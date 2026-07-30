 /**
 * Represents a resolved import relationship.
 */
export interface DependencyEdge {

  /**
   * Original import specifier.
   *
   * Example:
   * "./hello"
   */
  specifier: string;

  /**
   * Absolute resolved module path.
   *
   * Example:
   * "/hello.ts"
   */
  resolved: string;

}