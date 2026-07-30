import { describe, expect, it } from "vitest";

import { LanguageDetector } from "../src/detectors/LanguageDetector";

describe("LanguageDetector", () => {
  const detector = new LanguageDetector();

  it("detects TypeScript from main.tsx", () => {
    expect(detector.detect("/src/main.tsx")).toBe("ts");
  });

  it("detects JavaScript from main.jsx", () => {
    expect(detector.detect("/src/main.jsx")).toBe("js");
  });

  it("detects TypeScript from index.tsx", () => {
    expect(detector.detect("/src/index.tsx")).toBe("ts");
  });

  it("detects JavaScript from index.jsx", () => {
    expect(detector.detect("/src/index.jsx")).toBe("js");
  });
});