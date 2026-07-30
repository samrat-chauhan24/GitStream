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

  it("should execute the detected entry module", () => {

    const runner =
      createRunner({

        "/package.json": JSON.stringify({
          dependencies: {
            react: "^19.0.0",
          },
          devDependencies: {
            vite: "^7.0.0",
          },
        }),

        "/src/main.tsx": `
module.exports = {
  hello: "world",
};
`,

      });

    expect(
      runner.run(),
    ).toEqual({
      hello: "world",
    });

  });

  it("should execute imported modules", () => {

    const runner =
      createRunner({

        "/package.json": JSON.stringify({
          dependencies: {
            react: "^19.0.0",
          },
          devDependencies: {
            vite: "^7.0.0",
          },
        }),

        "/src/main.tsx": `
import { hello } from "./hello";

module.exports = hello;
`,

        "/src/hello.ts": `
export const hello = "world";
`,

      });

    expect(
      runner.run(),
    ).toBe("world");

  });

  it("should throw when package.json is missing", () => {

    const runner =
      createRunner({

        "/src/main.tsx": `
module.exports = {};
`,

      });

    expect(() =>
      runner.run(),
    ).toThrow(
      "package.json not found.",
    );

  });

  it("should throw when entry point is missing", () => {

    const runner =
      createRunner({

        "/package.json": JSON.stringify({
          dependencies: {
            react: "^19.0.0",
          },
        }),

      });

    expect(() =>
      runner.run(),
    ).toThrow(
      "Unable to determine project entry point.",
    );

  });

  it("should create a fresh runtime for each run", () => {

    (globalThis as any).__count = 0;

    const runner =
      createRunner({

        "/package.json": JSON.stringify({
          dependencies: {
            react: "^19.0.0",
          },
          devDependencies: {
            vite: "^7.0.0",
          },
        }),

        "/src/main.tsx": `
globalThis.__count++;

module.exports =
  globalThis.__count;
`,

      });

    expect(
      runner.run(),
    ).toBe(1);

    expect(
      runner.run(),
    ).toBe(2);

  });

});