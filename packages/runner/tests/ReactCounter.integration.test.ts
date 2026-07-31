import { describe, expect, it } from "vitest";

import {
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";

import {
  join,
  relative,
} from "node:path";

import { Analyzer } from "@gitstream/analyzer";
import { DependencyGraph } from "@gitstream/dependency-graph";
import { Resolver } from "@gitstream/resolver";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { Runner } from "../src/Runner";

describe("React Counter Integration", () => {

  function createRunner(
    root: string,
  ): Runner {

    const vfs =
      new VirtualFileSystem();

    function load(
      directory: string,
    ): void {

      for (const file of readdirSync(directory)) {

        const absolute =
          join(directory, file);

        if (statSync(absolute).isDirectory()) {

          load(absolute);
          continue;

        }

        const path =
          "/" +
          relative(root, absolute)
            .replace(/\\/g, "/");

        vfs.writeFile(
          path,
          readFileSync(
            absolute,
            "utf8",
          ),
        );

      }

    }

    load(root);

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

  it("should load and execute the React Counter project", () => {

    const root =
      join(
        process.cwd(),
        "../../examples/react-counter",
      );

    const runner =
      createRunner(root);

    expect(() => {
      runner.run();
    }).not.toThrow();

  });

});