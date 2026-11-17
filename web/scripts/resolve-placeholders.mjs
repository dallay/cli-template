#!/usr/bin/env node

/**
 * resolve-placeholders.mjs
 *
 * Replaces template tokens (e.g. `{{REPO_NAME}}`, `{{CARGO_NAME}}`) in all text
 * files under the `web/` directory with their resolved values.
 *
 * Backup & restore
 * ----------------
 * Before the first rewrite of each file, the script saves the original content
 * under `web/.placeholder-backup/<relative path>`.  A subsequent run will NOT
 * overwrite an existing backup, so the pristine copy is always preserved.
 *
 * To restore the original template values:
 *
 *     node scripts/resolve-placeholders.mjs --restore
 *
 * This copies every backed-up file back to its original location and removes
 * the backup directory.
 *
 * Flags
 * -----
 *   --dry-run    Preview replacements without writing any files.
 *   --restore    Restore original files from backup and remove the backup dir.
 *   --no-backup  Skip writing backups (useful in CI where the workspace is
 *                ephemeral).
 *
 * The script is idempotent: running it twice in a row leaves the tree unchanged
 * the second time because resolved values no longer contain the `{{TOKEN}}` pattern.
 *
 * Required environment variable:
 *
 *     GITHUB_REPOSITORY  -  "owner/name" (set automatically in GitHub Actions)
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  existsSync,
} from 'node:fs';
import {join, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const webRoot = join(__dirname, '..');           // web/ directory (parent of scripts/)
const repoRoot = join(webRoot, '..');            // project root (parent of web/)
const BACKUP_DIR = join(webRoot, '.placeholder-backup');

const TEXT_EXTENSIONS = new Set([
  '.md', '.ts', '.mjs', '.astro', '.css', '.json',
]);

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.astro',
  'scripts',
  '.placeholder-backup',
]);

// ---------------------------------------------------------------------------
// 1. Build the token map
// ---------------------------------------------------------------------------

function buildTokenMap() {
  const tokens = {};

  // -- GITHUB_REPOSITORY -> REPO_OWNER, REPO_NAME --------------------------
  const githubRepo = process.env.GITHUB_REPOSITORY;
  if (!githubRepo) {
    console.error('Error: GITHUB_REPOSITORY environment variable is not set.');
    console.error('This script expects "owner/name" (e.g. "dallay/cli-template").');
    process.exit(1);
  }
  const [owner, name, ...extra] = githubRepo.split('/');
  if (!owner || !name || extra.length > 0) {
    console.error(
      `Error: GITHUB_REPOSITORY has invalid value "${githubRepo}". Expected "owner/name".`,
    );
    process.exit(1);
  }
  tokens.REPO_OWNER = owner;
  tokens.REPO_NAME = name;

  // -- Cargo.toml -> CARGO_NAME --------------------------------------------
  const cargoPath = join(repoRoot, 'Cargo.toml');
  const cargoContent = readFileSync(cargoPath, 'utf8');

  // Prefer [[bin]] name, fall back to [package] name
  let cargoName = null;

  // Try [[bin]] name first
  const binMatch = cargoContent.match(/\[\[bin\]\]\s*name\s*=\s*"([^"]+)"/);
  if (binMatch) {
    cargoName = binMatch[1];
  } else {
    // Fall back to [package] name
    const pkgMatch = cargoContent.match(/\[package\]\s*name\s*=\s*"([^"]+)"/);
    if (pkgMatch) {
      cargoName = pkgMatch[1];
    }
  }
  if (!cargoName) {
    console.error('Error: Could not parse CARGO_NAME from Cargo.toml.');
    process.exit(1);
  }
  tokens.CARGO_NAME = cargoName;

  // -- npm package.json -> NPM_SCOPE ---------------------------------------
  // The npm wrapper may be at npm/<cargo_name>/ or npm/cli-template/
  const npmPackagePath = join(repoRoot, 'npm', cargoName, 'package.json');
  let npmScope = null;
  try {
    const npmPkg = JSON.parse(readFileSync(npmPackagePath, 'utf8'));
    const npmName = npmPkg.name;
    const scopeMatch = npmName.match(/^(@[^/]+)/);
    if (scopeMatch) {
      npmScope = scopeMatch[1];
    }
  } catch {
    console.error(
      `Warning: Could not read NPM scope from ${npmPackagePath}.`,
    );
  }
  if (npmScope) {
    tokens.NPM_SCOPE = npmScope;
  }

  // -- template.config.json -> PROJECT_NAME, AUTHOR, DOCKERHUB_USER ---------
  const templateConfigPath = join(repoRoot, 'template.config.json');
  try {
    const templateConfig = JSON.parse(
      readFileSync(templateConfigPath, 'utf8'),
    );
    if (templateConfig.projectName) {
      tokens.PROJECT_NAME = templateConfig.projectName;
    }
    if (templateConfig.author) {
      tokens.AUTHOR = templateConfig.author;
    }
    if (templateConfig.dockerhubUser) {
      tokens.DOCKERHUB_USER = templateConfig.dockerhubUser;
    }
  } catch (err) {
    console.error(
      `Warning: Could not read template.config.json: ${err.message}`,
    );
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// 2. Walk web/ and collect text files
// ---------------------------------------------------------------------------

function collectFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (stat.isFile()) {
      const ext = entry.includes('.') ? entry.slice(entry.lastIndexOf('.')) : '';
      if (TEXT_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// 3. Replace tokens & verify
// ---------------------------------------------------------------------------

const ALL_TOKENS = [
  'CARGO_NAME',
  'REPO_NAME',
  'REPO_OWNER',
  'PROJECT_NAME',
  'NPM_SCOPE',
  'AUTHOR',
  'DOCKERHUB_USER',
];

// ---------------------------------------------------------------------------
// Backup helpers
// ---------------------------------------------------------------------------

function backupFile(filePath) {
  const relPath = relative(webRoot, filePath);
  const backupPath = join(BACKUP_DIR, relPath);
  if (!existsSync(backupPath)) {
    mkdirSync(dirname(backupPath), {recursive: true});
    copyFileSync(filePath, backupPath);
  }
}

function restoreFiles() {
  if (!existsSync(BACKUP_DIR)) {
    console.log('No backup directory found. Nothing to restore.');
    return;
  }

  const entries = readdirSync(BACKUP_DIR, {recursive: true});
  const restored = [];

  for (const entry of entries) {
    const backupPath = join(BACKUP_DIR, entry);
    if (statSync(backupPath).isFile()) {
      const targetPath = join(webRoot, entry);
      copyFileSync(backupPath, targetPath);
      restored.push(entry);
    }
  }

  if (restored.length > 0) {
    for (const entry of restored) {
      console.log(`  Restored: ${entry}`);
    }
    rmSync(BACKUP_DIR, {recursive: true, force: true});
    console.log(`\nRestored ${restored.length} file(s) and removed backup directory.`);
  } else {
    console.log('No backup files found. Nothing to restore.');
    rmSync(BACKUP_DIR, {recursive: true, force: true});
  }
}

// ---------------------------------------------------------------------------
// 3. Replace tokens & verify
// ---------------------------------------------------------------------------

function replaceTokens(content, tokenMap) {
  let changed = false;
  for (const [token, value] of Object.entries(tokenMap)) {
    const placeholder = '{{' + token + '}}';
    const pattern = new RegExp(placeholder, 'g');
    if (pattern.test(content)) {
      content = content.replaceAll(placeholder, value);
      changed = true;
    }
  }
  return {content, changed};
}

function findRemainingTokens(content) {
  const remaining = [];
  for (const token of ALL_TOKENS) {
    const placeholder = '{{' + token + '}}';
    if (content.includes(placeholder)) {
      remaining.push(placeholder);
    }
  }
  return remaining;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const restore = args.includes('--restore');
  const noBackup = args.includes('--no-backup');

  // --restore mode: copy backups back and clean up
  if (restore) {
    console.log('Restoring original files from backup...\n');
    restoreFiles();
    return;
  }

  console.log('Building token map...');
  const tokenMap = buildTokenMap();
  console.log('Tokens:');
  for (const [key, value] of Object.entries(tokenMap)) {
    console.log(`  {{${key}}} = ${value}`);
  }

  console.log('\nScanning web/ for text files...');
  const files = collectFiles(webRoot);
  console.log(`Found ${files.length} text file(s).\n`);

  const changedFiles = [];
  const resolvedTokens = new Set();

  for (const filePath of files) {
    const original = readFileSync(filePath, 'utf8');
    const {content, changed} = replaceTokens(original, tokenMap);

    if (changed) {
      const relPath = relative(webRoot, filePath);
      changedFiles.push(relPath);

      // Track which tokens were resolved
      for (const token of ALL_TOKENS) {
        const placeholder = '{{' + token + '}}';
        if (original.includes(placeholder)) {
          resolvedTokens.add(token);
        }
      }

      if (dryRun) {
        console.log(`  [dry-run] Would rewrite: ${relPath}`);
      } else {
        // Backup original before first rewrite (skip if --no-backup)
        if (!noBackup) {
          backupFile(filePath);
        }
        writeFileSync(filePath, content, 'utf8');
        console.log(`  Rewrote: ${relPath}`);
      }
    }
  }

  // Verify no tokens remain in processed files
  if (!dryRun) {
    console.log('\nVerifying no unresolved tokens remain...');
    const remainingByFile = [];

    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf8');
      const remaining = findRemainingTokens(content);
      if (remaining.length > 0) {
        const relPath = relative(webRoot, filePath);
        remainingByFile.push({file: relPath, tokens: remaining});
      }
    }

    if (remainingByFile.length > 0) {
      console.error('\nError: Unresolved tokens found in the following files:');
      for (const {file, tokens} of remainingByFile) {
        console.error(`  ${file}: ${tokens.join(', ')}`);
      }
      process.exit(1);
    }
    console.log('All tokens resolved successfully.');
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Files changed: ${changedFiles.length}`);
  console.log(`Tokens resolved: ${[...resolvedTokens].join(', ') || '(none)'}`);
  if (dryRun) {
    console.log('(Dry run — no files were modified.)');
  }
  if (noBackup) {
    console.log('(No backup — backups were skipped via --no-backup.)');
  }
}

main();
