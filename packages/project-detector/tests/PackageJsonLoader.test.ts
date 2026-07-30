import { describe, expect, it } from "vitest";

import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { PackageJsonLoader } from "../src/loaders/PackageJsonLoader";

describe("PackageJsonLoader", () => {
  it("loads package.json", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      JSON.stringify({
        name: "demo",
        dependencies: {
          react: "^19.0.0",
        },
      }),
    );

    const loader = new PackageJsonLoader(fs);

    expect(loader.load()).toEqual({
      name: "demo",
      dependencies: {
        react: "^19.0.0",
      },
    });
  });

  it("throws when package.json is missing", () => {
    const fs = new VirtualFileSystem();

    const loader = new PackageJsonLoader(fs);

    expect(() => loader.load()).toThrow(
      "package.json not found.",
    );
  });

  it("throws when package.json contains invalid JSON", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      "{ invalid json",
    );

    const loader = new PackageJsonLoader(fs);

    expect(() => loader.load()).toThrow(
      "Invalid package.json.",
    );
  });
});