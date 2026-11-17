#!/usr/bin/env node
// Guards the published layout of the npm wrapper: the compiled entry point must
// come from dist/ and no TypeScript source may leak into the tarball.
import { execFileSync } from "node:child_process";

const REQUIRED = ["package.json", "dist/index.js", "dist/index.d.ts"];

const [pack] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json"], { encoding: "utf8" }),
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
