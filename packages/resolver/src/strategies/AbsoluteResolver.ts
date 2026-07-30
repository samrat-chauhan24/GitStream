import { VirtualFileSystem } from "@gitstream/virtual-fs";
import { ResolutionResult } from "../ResolutionResult";

/**
 * Resolves absolute virtual paths.
 */
export class AbsoluteResolver {

  constructor(
    private readonly vfs: VirtualFileSystem
  ) {}

  /**
   * Resolves an absolute virtual path.
   *
   * @param specifier Absolute virtual path.
   */
  resolve(
    specifier: string
  ): ResolutionResult {

    try {

      const stat =
        this.vfs.stat(specifier);

      return {
        found: stat.type === "file",
        path:
          stat.type === "file"
            ? specifier
            : null,
      };

    } catch (error) {

        if (error instanceof Error) {
          return {
            found: false,
            path: null,
          };
        }

        throw error;

      }

  }

}