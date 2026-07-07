import { GitHubLoaderError } from "./GitHubLoaderError";

/**
 * Thrown when a GitHub URL does not reference a repository.
 */
export class InvalidRepositoryUrlError extends GitHubLoaderError {
  constructor() {
    super("Invalid GitHub repository URL.");
  }
}