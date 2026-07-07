import { GitHubClient } from "../client";
import { GitHubTree } from "../models";

/**
 * Fetches the complete repository tree.
 */
export class RepositoryTreeFetcher {

  constructor(
    private readonly client: GitHubClient
  ) {}

  async fetch(
    owner: string,
    repo: string,
    branch: string
  ): Promise<GitHubTree> {

    return this.client.getRepositoryTree(
      owner,
      repo,
      branch
    );
  }

}