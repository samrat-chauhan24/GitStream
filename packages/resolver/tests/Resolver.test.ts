import { describe, expect, it } from "vitest";

import { VirtualFileSystem } from "@gitstream/virtual-fs";
import { Resolver } from "../src";

describe("Resolver", () => {

  it("should resolve a relative import", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      ""
    );

    vfs.writeFile(
      "/src/Button",
      ""
    );

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "./Button"
      );

    expect(result.found).toBe(true);

    expect(result.path).toBe(
      "/src/Button"
    );

  });

  it("should resolve an absolute import", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      ""
    );

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "/src/App.ts"
      );

    expect(result.found).toBe(true);

    expect(result.path).toBe(
      "/src/App.ts"
    );

  });

  it("should return not found for missing files", () => {

    const vfs = new VirtualFileSystem();

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "./Button"
      );

    expect(result.found).toBe(false);

    expect(result.path).toBeNull();

  });

  it("should return not found for node modules", () => {

    const vfs = new VirtualFileSystem();

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "react"
      );

    expect(result.found).toBe(false);

    expect(result.path).toBeNull();

  });

  it("should resolve parent directory imports", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/utils/math",
      ""
    );

    vfs.writeFile(
      "/src/components/Button.ts",
      ""
    );

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/components/Button.ts",
        "../utils/math"
      );

    expect(result.found).toBe(true);

    expect(result.path).toBe(
      "/src/utils/math"
    );

  });

  it("should resolve .ts files", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      ""
    );

    vfs.writeFile(
      "/src/Button.ts",
      ""
    );

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "./Button"
      );

    expect(result.found).toBe(true);

    expect(result.path).toBe(
      "/src/Button.ts"
    );

  });

  it("should resolve index.ts files", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      ""
    );

    vfs.writeFile(
      "/src/Button/index.ts",
      ""
    );

    const resolver =
      new Resolver(vfs);

    const result =
      resolver.resolve(
        "/src/App.ts",
        "./Button"
      );

    expect(result.found).toBe(true);

    expect(result.path).toBe(
      "/src/Button/index.ts"
    );

  });

});