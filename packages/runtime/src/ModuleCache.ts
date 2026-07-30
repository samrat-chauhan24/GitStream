import type { Module } from "@gitstream/core";

/**
 * Stores executed modules.
 */
export class ModuleCache {

  private readonly modules =
    new Map<string, Module>();

  /**
   * Returns true if the module exists.
   */
  has(
    id: string,
  ): boolean {

    return this.modules.has(id);

  }

  /**
   * Returns a cached module.
   */
  get(
    id: string,
  ): Module | undefined {

    return this.modules.get(id);

  }

  /**
   * Stores a module.
   */
  set(
    module: Module,
  ): void {

    this.modules.set(
      module.id,
      module,
    );

  }

  /**
   * Removes a module.
   */
  delete(
    id: string,
  ): void {

    this.modules.delete(id);

  }

  /**
   * Clears the cache.
   */
  clear(): void {

    this.modules.clear();

  }

  /**
   * Number of cached modules.
   */
  size(): number {

    return this.modules.size;

  }

}