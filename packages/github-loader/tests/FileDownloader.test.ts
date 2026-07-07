import { describe, expect, it } from "vitest";

import {
  GitHubClient,
  FileDownloader
} from "../src";

describe("FileDownloader", () => {

  it("downloads package.json", async () => {

    const client = new GitHubClient();

    const downloader =
      new FileDownloader(client);

    const file = await downloader.download(
      "react",
      "react",
      "package.json"
    );

    expect(file.path)
      .toBe("package.json");

    expect(file.content.length)
      .toBeGreaterThan(100);

  });

  it("downloads multiple files", async () => {

    const client = new GitHubClient();

    const downloader = new FileDownloader(client);

    const files = await downloader.downloadMany(
      "react",
      "react",
      [
        "package.json",
        "README.md"
      ]
    );

    expect(files.length).toBe(2);

    expect(files[0].path).toBe("package.json");

    expect(files[1].path).toBe("README.md");

  });

});