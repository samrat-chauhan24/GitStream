import { Analyzer } from "@gitstream/analyzer";
import { Resolver } from "@gitstream/resolver";
import { VirtualFileSystem } from "@gitstream/virtual-fs";

import {
  DependencyEdge,
  DependencyGraphResult,
  DependencyNode,
} from "./models";

/**
 * Builds a dependency graph by recursively
 * traversing project source files.
 */
export class GraphBuilder {

  private readonly visited =
    new Set<string>();

  private readonly nodes: DependencyNode[] =
    [];

  constructor(
    private readonly vfs: VirtualFileSystem,
    private readonly analyzer: Analyzer,
    private readonly resolver: Resolver,
  ) {}

  /**
   * Builds a dependency graph starting
   * from the given entry file.
   */
  build(
    entry: string
  ): DependencyGraphResult {

    this.visited.clear();
    this.nodes.length = 0;  
    
    this.visit(entry);

    return {
      entry,
      nodes: this.nodes,
    };

  }

  /**
   * Visits a file recursively.
   */
  private visit(
    path: string
  ): void {

    if (this.visited.has(path)) {
      return;
    }

    this.visited.add(path);

    const source =
      this.vfs.readFile(path);

    const analysis =
      this.analyzer.analyze(source);

    const dependencies: DependencyEdge[] = [];

    for (const specifier of analysis.imports) {

      const resolved =
        this.resolver.resolve(
          path,
          specifier
        );

      if (!resolved.found || !resolved.path) {
        continue;
      }

      dependencies.push({
        specifier,
        resolved: resolved.path
      });

      this.visit(
        resolved.path
      );

    }

    this.nodes.push({
      path,
      dependencies,
    });

  }

}