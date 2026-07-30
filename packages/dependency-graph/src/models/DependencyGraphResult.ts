import { DependencyNode } from "./DependencyNode";

/**
 * Represents a dependency graph.
 */
export interface DependencyGraphResult {

  /**
   * Entry file.
   */
  entry: string;

  /**
   * All discovered dependency nodes.
   */
  nodes: DependencyNode[];

}