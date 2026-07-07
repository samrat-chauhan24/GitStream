import { describe, expect, it } from "vitest";

import { GitHubLoader } from "../src";

describe("GitHubLoader", () => {

  it("loads a repository", async () => {

    const loader =
      new GitHubLoader();

    const repository =
      await loader.load(
        "https://github.com/react/react"
      );

    expect(repository.metadata.name)
      .toBe("react");

    expect(repository.tree.nodes.length)
      .toBeGreaterThan(0);

    expect(repository.files.size)
      .toBeGreaterThan(0);

  });

});