#!/usr/bin/env node

import {spawnSync} from "child_process";
import {join, dirname} from "path";
import {arch, platform} from "os";

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
  const packageName = `@dallay/cli-template-${os}-${cpu}`;

  // Try to resolve the binary from the platform-specific npm package
  try {
    const pkgPath = require.resolve(`${packageName}/package.json`, {paths: [__dirname]});
    const pkgDir = dirname(pkgPath);
    return join(pkgDir, "bin", binaryName);
  } catch {
    throw new Error(
      `Cannot find binary for ${packageName}. ` +
      `Please ensure the platform-specific package is installed.`
    );
  }
}

function main() {
  const binaryPath = getBinaryPath();
  const args = process.argv.slice(2);

  const result = spawnSync(binaryPath, args, {
    stdio: "inherit",
    encoding: "utf-8",
  });

  // Propagate the exit code from the binary
  const exitCode = result.status ?? 1;
  process.exit(exitCode);
}

main();
