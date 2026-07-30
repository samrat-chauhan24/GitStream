import { VirtualFileSystem } from "@gitstream/virtual-fs";

import {
  RelativeResolver,
  AbsoluteResolver,
  NodeModuleResolver,
} from "./strategies";

import { ResolutionResult } from "./ResolutionResult";
import { ResolutionError } from "./errors";

/**
 * Resolves module import specifiers
 * to virtual file paths.
 */
export class Resolver {

  private readonly relativeResolver: RelativeResolver;

  private readonly absoluteResolver: AbsoluteResolver;

  private readonly nodeModuleResolver: NodeModuleResolver;

  constructor(
    private readonly vfs: VirtualFileSystem
  ) {

    this.relativeResolver =
      new RelativeResolver(vfs);

    this.absoluteResolver =
      new AbsoluteResolver(vfs);

    this.nodeModuleResolver =
      new NodeModuleResolver();

  }

  /**
   * Resolves an import specifier.
   *
   * @param from Current file path.
   * @param specifier Import specifier.
   */
  resolve(
    from: string,
    specifier: string
  ): ResolutionResult {

    if (!from.startsWith("/")) {
      throw new ResolutionError(
        "Current file path must be absolute."
      );
    }

    if (!specifier.trim()) {
      throw new ResolutionError(
        "Import specifier cannot be empty."
      );
    }

    if (
      specifier.startsWith("./") ||
      specifier.startsWith("../")
    ) {
      return this.relativeResolver.resolve(
        from,
        specifier
      );
    }

    if (specifier.startsWith("/")) {
      return this.absoluteResolver.resolve(
        specifier
      );
    }

    return this.nodeModuleResolver.resolve();

  }

}