import { describe, expect, it } from "vitest";
import { GitHubClient } from "../src";

describe("GitHubClient", () => {
  it("fetches a public repository", async () => {
    const client = new GitHubClient();

    const repository = await client.getRepository(
        "react",
        "react"
    );

    expect(repository.name).toBe("react");
    expect(repository.fullName).toBe("react/react");
  });
});