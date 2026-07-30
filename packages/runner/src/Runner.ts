import { Compiler } from "@gitstream/compiler";
import { DependencyGraph } from "@gitstream/dependency-graph";
import { ProjectDetector } from "@gitstream/project-detector";
import { Runtime } from "@gitstream/runtime";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

/**
 * High-level GitStream execution pipeline.
 *
 * Automatically detects the project entry point,
 * compiles the project, and executes it.
 */
export class Runner {

  private readonly compiler: Compiler;

  private readonly detector: ProjectDetector;

  constructor(
    private readonly vfs: VirtualFileSystem,
    private readonly graph: DependencyGraph,
  ) {

    this.compiler =
      new Compiler(
        this.vfs,
        this.graph,
      );

    this.detector =
      new ProjectDetector(
        this.vfs,
      );

  }

  /**
   * Detects, compiles, and executes the project.
   */
  run(): unknown {

    const project =
      this.detector.detect();

    const bundle =
      this.compiler.compile(
        project.entry,
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