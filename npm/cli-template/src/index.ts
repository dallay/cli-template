#!/usr/bin/env node

import { execSync } from "child_process";
import { dirname, join } from "path";
import { platform, arch } from "os";
import { resolve } from "path";

function getBinaryPath(): string {
  const platformMap: Record<string, string> = {
    linux: "linux",
    darwin: "darwin",
    win32: "win32",
  };

  const archMap: Record<string, string> = {
    x64: "x64",
    arm64: "arm64",
  };

  const os = platformMap[platform()];
  const cpu = archMap[arch()];

  if (!os || !cpu) {
    throw new Error(`Unsupported platform: ${platform()} ${arch()}`);
  }

  const binaryName = process.platform === "win32" ? "cli-template.exe" : "cli-template";
  return join(dirname(__filename), "..", "bin", binaryName);
}

function main() {
  try {
    const binaryPath = getBinaryPath();
    const args = process.argv.slice(2);
    execSync(`${binaryPath} ${args.join(" ")}`, { stdio: "inherit" });
  } catch (error) {
    console.error("Error running cli-template:", error);
    process.exit(1);
  }
}

main();
