/**
 * Represents the result of resolving an import.
 */
export interface ResolutionResult {

  /**
   * Whether the import was successfully resolved.
   */
  found: boolean;

  /**
   * The resolved virtual file path.
   * Null when no matching file exists.
   */
  path: string | null;

}