import { DependencyGraph } from "@gitstream/dependency-graph";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { Bundle } from "./Bundle";
import { ModuleWrapper } from "./ModuleWrapper";
import { RuntimeGenerator } from "./RuntimeGenerator";
import { Transpiler } from "./Transpiler";
import { ModuleTransformer } from "./ModuleTransformer";

/**
 * Compiles a project into a single executable bundle.
 */
export class Compiler {

  private readonly transpiler =
    new Transpiler();

  private readonly wrapper =
    new ModuleWrapper();

  private readonly runtime =
    new RuntimeGenerator();

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

    const modules: string[] = [];

    for (const node of dependencyGraph.nodes) {

      const source =
        this.vfs.readFile(node.path);

      const transpiled =
        this.transpiler.transpile(source);

      const transformed =
        this.transformer.transform(transpiled);

      const wrapped =
        this.wrapper.wrap(
          node.path,
          transformed,
        );

      modules.push(wrapped);

    }

    const code =
      this.runtime.generate(
        entry,
        modules,
      );

    return {
      entry,
      code,
    };

  }

}