import { describe, expect, it } from "vitest";
import { UrlParser } from "../src";

describe("UrlParser", () => {
  const parser = new UrlParser();

  it("parses a basic GitHub repository URL", () => {
    expect(parser.parse("https://github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react"
    });
  });

  it("parses a URL with trailing slash", () => {
    expect(parser.parse("https://github.com/facebook/react/")).toEqual({
      owner: "facebook",
      repo: "react"
    });
  });

  it("parses a tree URL", () => {
    expect(
      parser.parse("https://github.com/facebook/react/tree/main")
    ).toEqual({
      owner: "facebook",
      repo: "react",
      branch: "main"
    });
  });

  it("throws for invalid URL", () => {
    expect(() => parser.parse("https://google.com")).toThrow();
  });
});