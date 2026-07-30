import { VirtualFileSystem } from "@gitstream/virtual-fs";
import { ResolutionResult } from "../ResolutionResult";

/**
 * Resolves relative import specifiers.
 */
export class RelativeResolver {

  constructor(
    private readonly vfs: VirtualFileSystem
  ) {}

  /**
   * Resolves a relative import.
   *
   * @param from Current file path.
   * @param specifier Relative import specifier.
   */
  resolve(
    from: string,
    specifier: string
  ): ResolutionResult {

    const currentDirectory =
      from.substring(0, from.lastIndexOf("/"));

    const segments = [
      ...currentDirectory.split("/"),
      ...specifier.split("/")
    ];

    const normalized: string[] = [];

    for (const segment of segments) {

      if (
        segment === "" ||
        segment === "."
      ) {
        continue;
      }

      if (segment === "..") {
        normalized.pop();
        continue;
      }

      normalized.push(segment);

    }

    const basePath =
      "/" + normalized.join("/");

    const resolvedPath =
      this.resolveCandidate(basePath);

    return {
      found: resolvedPath !== null,
      path: resolvedPath,
    };

  }

  /**
   * Attempts to resolve a file by trying
   * supported file extensions and index files.
   */
    private resolveCandidate(
    basePath: string
    ): string | null {

    const candidates = [
        basePath,
        `${basePath}.ts`,
        `${basePath}.tsx`,
        `${basePath}.js`,
        `${basePath}.jsx`,
        `${basePath}/index.ts`,
        `${basePath}/index.tsx`,
        `${basePath}/index.js`,
        `${basePath}/index.jsx`,
    ];

    for (const candidate of candidates) {

        try {

        const stat =
            this.vfs.stat(candidate);

        if (stat.type === "file") {
            return candidate;
        }

        } catch {

        // Candidate does not exist.
        continue;

        }

    }

    return null;

    }

}