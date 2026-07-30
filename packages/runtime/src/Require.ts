import type {
  Module,
  ModuleFactory,
  ModuleRegistry,
} from "@gitstream/core";

import { ModuleCache } from "./ModuleCache";
import { RuntimeError } from "./errors/RuntimeError";

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
    const source =
      this.modules[id];

    if (!source) {
      throw new RuntimeError(
        `Cannot find module "${id}"`,
      );
    }

    // Lazily compile the module source
    const factory =
      new Function(
          "module",
          "exports",
          "require",
          source,
      ) as ModuleFactory;

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