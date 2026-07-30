import { describe, expect, it } from "vitest";

import { Analyzer } from "@gitstream/analyzer";
import { DependencyGraph } from "@gitstream/dependency-graph";
import { Resolver } from "@gitstream/resolver";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { Runner } from "../src/Runner";

describe("Runner", () => {

  function createRunner(
    files: Record<string, string>,
  ): Runner {

    const vfs =
      new VirtualFileSystem();

    for (const [path, source] of Object.entries(files)) {
      vfs.writeFile(
        path,
        source,
      );
    }

    const analyzer =
      new Analyzer();

    const resolver =
      new Resolver(
        vfs,
      );

    const graph =
      new DependencyGraph(
        vfs,
        analyzer,
        resolver,
      );

    return new Runner(
      vfs,
      graph,
    );

  }

  it("should execute the entry module", () => {

    const runner =
      createRunner({
        "/index.ts": `
module.exports = {
  hello: "world",
};
`,
      });

    expect(
      runner.run("/index.ts"),
    ).toEqual({
      hello: "world",
    });

  });

  it("should execute imported modules", () => {

    const runner =
      createRunner({

        "/index.ts": `
import { hello } from "./hello";

module.exports = hello;
`,

        "/hello.ts": `
export const hello = "world";
`,

      });

    expect(
      runner.run("/index.ts"),
    ).toBe("world");

  });

  it("should throw for missing entry", () => {

    const runner =
      createRunner({});

    expect(() =>
      runner.run("/missing.ts"),
    ).toThrow();

  });

  it("should create a fresh runtime for each run", () => {

    (globalThis as any).__count = 0;

    const runner =
      createRunner({

        "/index.ts": `
globalThis.__count++;

module.exports =
  globalThis.__count;
`,

      });

    expect(
      runner.run("/index.ts"),
    ).toBe(1);

    expect(
      runner.run("/index.ts"),
    ).toBe(2);

  });

});