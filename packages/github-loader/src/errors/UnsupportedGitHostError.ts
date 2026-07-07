import { GitHubLoaderError } from "./GitHubLoaderError";

/**
 * Thrown when the URL host is not GitHub.
 */
export class UnsupportedGitHostError extends GitHubLoaderError {
  constructor(host: string) {
    super(`Unsupported Git host: "${host}". Only github.com is supported.`);
  }
}