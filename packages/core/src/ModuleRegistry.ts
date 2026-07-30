import type { ModuleSource } from "./ModuleSource";

/**
 * Maps module identifiers to their compiled source.
 */
export type ModuleRegistry = Record<
  string,
  ModuleSource
>;