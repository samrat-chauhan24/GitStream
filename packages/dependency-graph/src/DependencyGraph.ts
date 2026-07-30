import { Analyzer } from "@gitstream/analyzer";
import { Resolver } from "@gitstream/resolver";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { GraphBuilder } from "./GraphBuilder";
import { DependencyGraphResult } from "./models";

/**
 * Public API for building dependency graphs.
 */
export class DependencyGraph {

  private readonly builder: GraphBuilder;

  constructor(
    private readonly vfs: VirtualFileSystem,
    private readonly analyzer: Analyzer,
    private readonly resolver: Resolver,
  ) {

    this.builder =
      new GraphBuilder(
        vfs,
        analyzer,
        resolver,
      );

  }

  /**
   * Builds a dependency graph starting
   * from the specified entry file.
   */
  build(
    entry: string
  ): DependencyGraphResult {

    return this.builder.build(entry);

  }

}