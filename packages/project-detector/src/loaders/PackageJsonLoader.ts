import type { VirtualFileSystem } from "@gitstream/virtual-fs";

import type { PackageJson } from "../models/PackageJson";

export class PackageJsonLoader {
  constructor(
    private readonly fs: VirtualFileSystem,
  ) {}

  load(): PackageJson {
    if (!this.fs.exists("/package.json")) {
      throw new Error("package.json not found.");
    }

    try {
      return JSON.parse(
        this.fs.readFile("/package.json"),
      ) as PackageJson;
    } catch {
      throw new Error("Invalid package.json.");
    }
  }
}