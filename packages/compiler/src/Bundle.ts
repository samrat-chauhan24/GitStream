/**
 * Represents the compiled output bundle.
 */
export interface Bundle {

  /**
   * The generated JavaScript bundle.
   */
  code: string;

  /**
   * The entry file used for compilation.
   */
  entry: string;

}