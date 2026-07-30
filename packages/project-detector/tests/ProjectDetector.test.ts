import { describe, expect, it } from "vitest";

import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { ProjectDetector } from "../src/ProjectDetector";

describe("ProjectDetector", () => {
  it("detects a React Vite TypeScript project", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      JSON.stringify({
        name: "demo",
        dependencies: {
          react: "^19.0.0",
        },
        devDependencies: {
          vite: "^7.0.0",
        },
      }),
    );

    fs.writeFile(
      "/src/main.tsx",
      "console.log('hello');",
    );

    const detector = new ProjectDetector(fs);

    expect(detector.detect()).toEqual({
      framework: "react",
      bundler: "vite",
      language: "ts",
      entry: "/src/main.tsx",
      packageJsonPath: "/package.json",
    });
  });

  it("detects a React CRA JavaScript project", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      JSON.stringify({
        dependencies: {
          react: "^19.0.0",
          "react-scripts": "^5.0.1",
        },
      }),
    );

    fs.writeFile(
      "/src/index.jsx",
      "console.log('hello');",
    );

    const detector = new ProjectDetector(fs);

    expect(detector.detect()).toEqual({
      framework: "react",
      bundler: "cra",
      language: "js",
      entry: "/src/index.jsx",
      packageJsonPath: "/package.json",
    });
  });

  it("throws when package.json is missing", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/main.tsx", "");

    const detector = new ProjectDetector(fs);

    expect(() => detector.detect()).toThrow(
      "package.json not found.",
    );
  });

  it("throws when entry point is missing", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      JSON.stringify({
        dependencies: {
          react: "^19.0.0",
        },
      }),
    );

    const detector = new ProjectDetector(fs);

    expect(() => detector.detect()).toThrow(
      "Unable to determine project entry point.",
    );
  });

  it("throws when package.json contains invalid JSON", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      "{ invalid json",
    );

    const detector = new ProjectDetector(fs);

    expect(() => detector.detect()).toThrow(
      "Invalid package.json.",
    );
  });

  it("prefers main.tsx when multiple entry files exist", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile(
      "/package.json",
      JSON.stringify({
        dependencies: {
          react: "^19.0.0",
        },
        devDependencies: {
          vite: "^7.0.0",
        },
      }),
    );

    fs.writeFile("/src/main.tsx", "");
    fs.writeFile("/src/index.tsx", "");

    const detector = new ProjectDetector(fs);

    expect(detector.detect().entry).toBe(
      "/src/main.tsx",
    );
  });
});