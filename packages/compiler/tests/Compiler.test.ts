import { describe, expect, it } from "vitest";

import { Analyzer } from "@gitstream/analyzer";
import { DependencyGraph } from "@gitstream/dependency-graph";
import { Resolver } from "@gitstream/resolver";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { Compiler } from "../src";

describe("Compiler", () => {

  it("should compile a single file", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      `console.log("Hello");`
    );

    const compiler = new Compiler(
      vfs,
      new DependencyGraph(
        vfs,
        new Analyzer(),
        new Resolver(vfs)
      )
    );

    const bundle = compiler.compile(
      "/src/App.ts"
    );

    expect(bundle.entry).toBe(
      "/src/App.ts"
    );

    expect(bundle.code).toContain(
      'console.log("Hello");'
    );

  });

  it("should include wrapped modules", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      `console.log("App");`
    );

    const compiler = new Compiler(
      vfs,
      new DependencyGraph(
        vfs,
        new Analyzer(),
        new Resolver(vfs)
      )
    );

    const bundle = compiler.compile(
      "/src/App.ts"
    );

    expect(bundle.code).toContain(
      '"/src/App.ts": function'
    );

  });

  it("should generate a runtime", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      ""
    );

    const compiler = new Compiler(
      vfs,
      new DependencyGraph(
        vfs,
        new Analyzer(),
        new Resolver(vfs)
      )
    );

    const bundle = compiler.compile(
      "/src/App.ts"
    );

    expect(bundle.code).toContain(
      "function require"
    );

    expect(bundle.code).toContain(
      'require("/src/App.ts")'
    );

  });

});