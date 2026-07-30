import type { DependencyEdge } from "./DependencyEdge";

/**
 * Represents a file in the dependency graph.
 */
export interface DependencyNode {

  /**
   * Absolute virtual file path.
   */
  path: string;

  /**
   * Direct dependencies of this module.
   */
  dependencies: DependencyEdge[];

}