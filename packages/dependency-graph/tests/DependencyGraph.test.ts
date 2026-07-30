import { describe, expect, it } from "vitest";

import { VirtualFileSystem } from "@gitstream/virtual-fs";
import { Analyzer } from "@gitstream/analyzer";
import { Resolver } from "@gitstream/resolver";

import { DependencyGraph } from "../src";

describe("DependencyGraph", () => {

  it("should create a dependency graph instance", () => {

    const vfs = new VirtualFileSystem();
    const analyzer = new Analyzer();
    const resolver = new Resolver(vfs);

    const graph = new DependencyGraph(
      vfs,
      analyzer,
      resolver
    );

    expect(graph).toBeInstanceOf(
      DependencyGraph
    );

  });

  it("should build an empty graph for a file with no imports", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      "console.log('hello');"
    );

    const analyzer = new Analyzer();
    const resolver = new Resolver(vfs);

    const graph = new DependencyGraph(
      vfs,
      analyzer,
      resolver
    );

    const result = graph.build(
      "/src/App.ts"
    );

    expect(result.entry).toBe(
      "/src/App.ts"
    );

    expect(result.nodes).toHaveLength(1);

  });

  it("should throw for a missing entry file", () => {

    const vfs = new VirtualFileSystem();

    const analyzer = new Analyzer();
    const resolver = new Resolver(vfs);

    const graph = new DependencyGraph(
      vfs,
      analyzer,
      resolver
    );

    expect(() =>
      graph.build("/src/App.ts")
    ).toThrow();

  });

  it("should build nested dependencies", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      'import "./Button";'
    );

    vfs.writeFile(
      "/src/Button.ts",
      'import "./Utils";'
    );

    vfs.writeFile(
      "/src/Utils.ts",
      ""
    );

    const graph = new DependencyGraph(
      vfs,
      new Analyzer(),
      new Resolver(vfs)
    );

    const result = graph.build(
      "/src/App.ts"
    );

    expect(result.nodes).toHaveLength(3);

  });
  
  it("should handle circular dependencies", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/A.ts",
      'import "./B";'
    );

    vfs.writeFile(
      "/src/B.ts",
      'import "./A";'
    );

    const graph = new DependencyGraph(
      vfs,
      new Analyzer(),
      new Resolver(vfs)
    );

    const result = graph.build(
      "/src/A.ts"
    );

    expect(result.nodes).toHaveLength(2);

  });

  it("should ignore duplicate imports", () => {

    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/App.ts",
      `
        import "./Button";
        import "./Button";
      `
    );

    vfs.writeFile(
      "/src/Button.ts",
      ""
    );

    const graph = new DependencyGraph(
      vfs,
      new Analyzer(),
      new Resolver(vfs)
    );

    const result = graph.build(
      "/src/App.ts"
    );

    expect(result.nodes).toHaveLength(2);

  });



});