import { describe, expect, it } from "vitest";

import { VirtualFileSystem } from "@gitstream/virtual-fs";

import { EntryDetector } from "../src/detectors/EntryDetector";

describe("EntryDetector", () => {
  it("finds src/main.tsx", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/main.tsx", "");

    const detector = new EntryDetector(fs);

    expect(detector.detect()).toBe("/src/main.tsx");
  });

  it("finds src/main.jsx", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/main.jsx", "");

    const detector = new EntryDetector(fs);

    expect(detector.detect()).toBe("/src/main.jsx");
  });

  it("finds src/index.tsx", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/index.tsx", "");

    const detector = new EntryDetector(fs);

    expect(detector.detect()).toBe("/src/index.tsx");
  });

  it("finds src/index.jsx", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/index.jsx", "");

    const detector = new EntryDetector(fs);

    expect(detector.detect()).toBe("/src/index.jsx");
  });

  it("prefers main.tsx over index.tsx", () => {
    const fs = new VirtualFileSystem();

    fs.writeFile("/src/main.tsx", "");
    fs.writeFile("/src/index.tsx", "");

    const detector = new EntryDetector(fs);

    expect(detector.detect()).toBe("/src/main.tsx");
  });

  it("throws when no entry point exists", () => {
    const fs = new VirtualFileSystem();

    const detector = new EntryDetector(fs);

    expect(() => detector.detect()).toThrow(
      "Unable to determine project entry point.",
    );
  });
});