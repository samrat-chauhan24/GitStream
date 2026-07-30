import type { Module } from "./Module";
import { ModuleCache } from "./ModuleCache";
import { RuntimeError } from "./errors/RuntimeError";

/**
 * A compiled GitStream module.
 */
export type ModuleFactory = (
  module: Module,
  exports: unknown,
  require: (id: string) => unknown,
) => void;

/**
 * Registry of compiled modules.
 */
export type ModuleRegistry =
  Record<string, ModuleFactory>;

/**
 * CommonJS require implementation.
 */
export class Require {

  constructor(
    private readonly modules: ModuleRegistry,
    private readonly cache: ModuleCache,
  ) {}

  /**
   * Loads a module.
   */
  load(
    id: string,
  ): unknown {

    // Already executed
    const cached =
      this.cache.get(id);

    if (cached) {
      return cached.exports;
    }

    // Missing module
    const factory =
      this.modules[id];

    if (!factory) {
      throw new RuntimeError(
        `Cannot find module "${id}"`,
      );
    }

    // Create module before execution.
    // Enables circular dependencies.
    const module: Module = {
      id,
      exports: {},
    };

    this.cache.set(module);

    factory(
      module,
      module.exports,
      this.load.bind(this),
    );

    return module.exports;

  }

}