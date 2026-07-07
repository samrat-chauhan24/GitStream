import {
  Repository
} from "../models";

import { UrlParser } from "../parser";

import { GitHubClient } from "../client";

import { RepositoryTreeFetcher } from "../fetcher";

import { FileDownloader } from "../downloader";

import { RepositoryBuilder } from "../builder";

export class GitHubLoader {

  private readonly parser = new UrlParser();

  private readonly client = new GitHubClient();

  private readonly treeFetcher =
    new RepositoryTreeFetcher(this.client);

  private readonly downloader =
    new FileDownloader(this.client);

  private readonly builder =
    new RepositoryBuilder();

  async load(
    repositoryUrl: string
  ): Promise<Repository> {

    // Parse URL
    const reference =
      this.parser.parse(repositoryUrl);

    // Metadata
    const metadata =
      await this.client.getRepository(
        reference.owner,
        reference.repo
      );

    // Repository tree
    const tree =
      await this.treeFetcher.fetch(
        reference.owner,
        reference.repo,
        metadata.defaultBranch
      );

    // Blob paths
    const paths = tree.nodes
      .filter(node => node.type === "blob")
      .map(node => node.path)
      .slice(0,10); // temp limit 
      console.log(paths);

    // Download files
    const files =
      await this.downloader.downloadMany(
        reference.owner,
        reference.repo,
        paths
      );

    // Build repository
    return this.builder.build(
      metadata,
      tree,
      files
    );

  }

}