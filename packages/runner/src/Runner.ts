import { Compiler } from "@gitstream/compiler";
import { DependencyGraph } from "@gitstream/dependency-graph";
import { Runtime } from "@gitstream/runtime";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

/**
 * High-level GitStream execution pipeline.
 *
 * Coordinates compilation and execution.
 */
export class Runner {

  private readonly compiler: Compiler;

  constructor(
    private readonly vfs: VirtualFileSystem,
    private readonly graph: DependencyGraph,
  ) {

    this.compiler =
      new Compiler(
        this.vfs,
        this.graph,
      );

  }

  /**
   * Compiles and executes the project.
   */
  run(
    entry: string,
  ): unknown {

    const bundle =
      this.compiler.compile(
        entry,
      );

    const runtime =
      new Runtime(
        bundle.modules,
      );

    return runtime.run(
      bundle.entry,
    );

  }

}