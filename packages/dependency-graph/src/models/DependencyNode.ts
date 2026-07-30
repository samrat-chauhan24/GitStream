/**
 * Represents a file in the dependency graph.
 */
export interface DependencyNode {

  /**
   * Absolute virtual file path.
   */
  path: string;

  /**
   * Absolute paths of all direct dependencies.
   */
  dependencies: string[];

}