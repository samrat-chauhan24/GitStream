import { ModuleCache } from "./ModuleCache";
import {
  ModuleRegistry,
  Require,
} from "./Require";

/**
 * Executes compiled GitStream bundles.
 */
export class Runtime {

  private readonly cache =
    new ModuleCache();

  private readonly require;

  constructor(
    private readonly modules: ModuleRegistry,
  ) {

    this.require =
      new Require(
        modules,
        this.cache,
      );

  }

  /**
   * Executes the entry module.
   */
  run(
    entry: string,
  ): unknown {

    return this.require.load(
      entry,
    );

  }

  /**
   * Clears the module cache.
   */
  reset(): void {

    this.cache.clear();

  }

}