import { describe, expect, it } from "vitest";

import {
  GitHubClient,
  RepositoryTreeFetcher
} from "../src";

describe("RepositoryTreeFetcher", () => {

  it("fetches repository tree", async () => {

    const client = new GitHubClient();

    const fetcher = new RepositoryTreeFetcher(client);

    const tree = await fetcher.fetch(
      "react",
      "react",
      "main"
    );

    expect(tree.truncated).toBe(false);

    expect(tree.nodes.length).toBeGreaterThan(0);

  });

});