import type { Module } from "./Module";

/**
 * Factory function for a compiled module.
 */
export type ModuleFactory = (
  module: Module,
  exports: unknown,
  require: (id: string) => unknown,
) => void;