import type {
  ModuleRegistry,
} from "@gitstream/core";

import type { Bundle } from "./Bundle";

import { DependencyGraph } from "@gitstream/dependency-graph";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { ModuleTransformer } from "./ModuleTransformer";
import { Transpiler } from "./Transpiler";

/**
 * Compiles a project into an executable bundle.
 */
export class Compiler {

  private readonly transpiler =
    new Transpiler();

  private readonly transformer =
    new ModuleTransformer();

  constructor(
    private readonly vfs: VirtualFileSystem,
    private readonly graph: DependencyGraph,
  ) {}

  /**
   * Compiles the project starting from the
   * given entry file.
   */
  compile(
    entry: string,
  ): Bundle {

    const dependencyGraph =
      this.graph.build(entry);

    const modules: ModuleRegistry = {};

    for (const node of dependencyGraph.nodes) {

      const source =
        this.vfs.readFile(node.path);

      if (source === undefined) {
        throw new Error(
          `Module not found: ${node.path}`,
        );
      }

      const transpiled =
        this.transpiler.transpile(
          source,
        );

      const transformed =
        this.transformer.transform(
          transpiled,
          node.dependencies,
        );

      modules[node.path] =
        transformed;

    }

    return {
      entry,
      modules,
    };

  }

}