#!/usr/bin/env node
// Guard: reject `npm publish` unless all five platform optionalDependencies are
// present and their version matches the base package version.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8"));

const platforms = ["darwin-arm64", "darwin-x64", "linux-arm64", "linux-x64", "win32-x64"];
const baseName = pkg.name; // e.g. "@dallay/cli-template"
const version = pkg.version;

if (version === "0.0.0") {
  console.error("Release package check failed:");
  console.error("  - Version is placeholder 0.0.0; set a real version before publishing.");
  process.exit(1);
}

const deps = pkg.optionalDependencies || {};

const errors = [];

for (const platform of platforms) {
  const depName = `${baseName}-${platform}`;
  const depVersion = deps[depName];
  if (!depVersion) {
    errors.push(`Missing optionalDependency: ${depName}`);
  } else if (depVersion !== version) {
    errors.push(
      `Version mismatch for ${depName}: expected ${version}, got ${depVersion}`,
    );
  }
}

if (errors.length > 0) {
  console.error("Release package check failed:");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`All ${platforms.length} platform packages present at version ${version}.`);
