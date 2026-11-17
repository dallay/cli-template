#!/usr/bin/env node
// Guards the published layout of the npm wrapper: the compiled entry point must
// come from dist/ and no TypeScript source may leak into the tarball.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { isAbsolute, resolve, dirname } from "node:path";

// Resolve an absolute path to the npm CLI to avoid PATH lookup.
function resolveNpmCli() {
  // Prefer npm_execpath when it points to a valid absolute path.
  const execPath = process.env.npm_execpath;
  if (execPath && isAbsolute(execPath) && existsSync(execPath)) {
    return execPath;
  }
  // Fallback: derive absolute npm CLI path from the Node binary location.
  const nodeDir = dirname(process.execPath);
  const candidates = [
    resolve(nodeDir, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
    resolve(nodeDir, "..", "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
  ];
  // Windows: npm lives under node_modules/npm/bin/npm-cli.js next to the node binary.
  if (process.platform === "win32") {
    candidates.push(
      resolve(nodeDir, "node_modules", "npm", "bin", "npm-cli.js"),
    );
  }
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    "Cannot locate npm CLI. Set npm_execpath or ensure npm is installed alongside Node.",
  );
}

const REQUIRED = ["package.json", "dist/index.js", "dist/index.d.ts"];

const npmCli = resolveNpmCli();

const [pack] = JSON.parse(
  execFileSync(process.execPath, [npmCli, "pack", "--dry-run", "--json"], { encoding: "utf8" }),
);
const files = pack.files.map((file) => file.path);

const missing = REQUIRED.filter((path) => !files.includes(path));
const leaked = files.filter(
  (path) => path.startsWith("src/") || (path.endsWith(".ts") && !path.endsWith(".d.ts")),
);

if (missing.length > 0 || leaked.length > 0) {
  if (missing.length > 0) {
    console.error(`Missing from the package: ${missing.join(", ")}`);
  }
  if (leaked.length > 0) {
    console.error(`Unexpected source files in the package: ${leaked.join(", ")}`);
  }
  process.exit(1);
}

console.log(`Package layout OK: ${files.join(", ")}`);
