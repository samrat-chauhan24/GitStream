/**
 * Represents a CommonJS module.
 */
export interface Module {

  /**
   * Module identifier.
   */
  id: string;

  /**
   * Module exports.
   */
  exports: unknown;

}