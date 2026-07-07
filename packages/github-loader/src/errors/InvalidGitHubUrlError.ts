import { GitHubLoaderError } from "./GitHubLoaderError";

/**
 * Thrown when the supplied URL is not a valid URL.
 */
export class InvalidGitHubUrlError extends GitHubLoaderError {
  constructor(url: string) {
    super(`Invalid GitHub URL: "${url}"`);
  }
}