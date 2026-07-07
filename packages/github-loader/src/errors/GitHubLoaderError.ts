/**
 * Base class for all GitHub Loader errors.
 */
export class GitHubLoaderError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}