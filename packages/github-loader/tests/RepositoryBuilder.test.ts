import { describe, expect, it } from "vitest";

import {
  GitHubClient,
  RepositoryTreeFetcher,
  FileDownloader,
  RepositoryBuilder
} from "../src";

describe("RepositoryBuilder", () => {

  it("builds a repository", async () => {

    const client = new GitHubClient();

    const repository =
      await client.getRepository(
        "react",
        "react"
      );

    const treeFetcher =
      new RepositoryTreeFetcher(client);

    const tree =
      await treeFetcher.fetch(
        "react",
        "react",
        repository.defaultBranch
      );

    const downloader =
      new FileDownloader(client);

    const packageJson =
      await downloader.download(
        "react",
        "react",
        "package.json"
      );

    const builder =
      new RepositoryBuilder();

    const repo =
      builder.build(
        repository,
        tree,
        [packageJson]
      );

    expect(repo.metadata.name)
      .toBe("react");

    expect(repo.tree.nodes.length)
      .toBeGreaterThan(0);

    expect(repo.files.has("package.json"))
      .toBe(true);

  });

});