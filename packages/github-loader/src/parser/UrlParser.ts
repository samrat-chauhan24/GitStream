import { GitHubRepositoryReference } from "../types/GitHubRepositoryReference";
import {
  InvalidGitHubUrlError,
  UnsupportedGitHostError,
  InvalidRepositoryUrlError,
} from "../errors";

/**
 * Parses GitHub repository URLs into a structured reference.
 *
 * Supported formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/
 * - https://github.com/owner/repo/tree/main
 * - https://github.com/owner/repo/tree/main/src/components
 * - https://github.com/owner/repo/blob/main/package.json
 */
export class UrlParser {
  /**
   * Parses a GitHub repository URL.
   *
   * @param url GitHub repository URL.
   * @returns Parsed repository reference.
   * @throws Error if the URL is invalid or not a GitHub repository.
   */
  parse(url: string): GitHubRepositoryReference {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      throw new InvalidGitHubUrlError(url);
    }

    if (parsedUrl.hostname !== "github.com") {
      throw new UnsupportedGitHostError(parsedUrl.hostname);
    }

    const parts = parsedUrl.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      throw new InvalidRepositoryUrlError();
    }

    const [owner, repo] = parts;

    const reference: GitHubRepositoryReference = {
      owner,
      repo,
    };

    if (
      (parts[2] === "tree" || parts[2] === "blob") &&
      parts.length >= 4
    ) {
      reference.branch = parts[3];

      if (parts.length > 4) {
        reference.path = parts.slice(4).join("/");
      }
    }

    return reference;
  }
}