import type { ModuleRegistry } from "@gitstream/core";

/**
 * Represents the compiled output bundle.
 */
export interface Bundle {

  /**
   * Entry module.
   */
  entry: string;

  /**
   * Compiled module registry.
   */
  modules: ModuleRegistry;

}