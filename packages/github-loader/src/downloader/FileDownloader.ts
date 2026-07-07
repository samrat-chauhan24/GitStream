import { GitHubClient } from "../client";
import { GitHubFile } from "../models";

export class FileDownloader {

  constructor(
    private readonly client: GitHubClient
  ) {}

  async download(
    owner: string,
    repo: string,
    path: string
  ): Promise<GitHubFile> {

    return this.client.getFile(
      owner,
      repo,
      path
    );
  }

  async downloadMany(
    owner: string,
    repo: string,
    paths: string[]
  ): Promise<GitHubFile[]> {

    return Promise.all(
      paths.map(path =>
        this.download(owner, repo, path)
      )
    );

  }

}