import { describe, expect, it } from "vitest";

import { FrameworkDetector } from "../src/detectors/FrameworkDetector";
import type { PackageJson } from "../src/models/PackageJson";

describe("FrameworkDetector", () => {
  const detector = new FrameworkDetector();

  it("detects React using dependencies", () => {
    const packageJson: PackageJson = {
      dependencies: {
        react: "^19.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("react");
  });

  it("detects React using devDependencies", () => {
    const packageJson: PackageJson = {
      devDependencies: {
        react: "^19.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("react");
  });

  it("returns unknown when React is absent", () => {
    const packageJson: PackageJson = {
      dependencies: {
        vue: "^3.5.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("unknown");
  });

  it("ignores unrelated packages", () => {
    const packageJson: PackageJson = {
      dependencies: {
        lodash: "^4.17.21",
      },
      devDependencies: {
        typescript: "^5.0.0",
        vite: "^7.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("unknown");
  });

  it("returns unknown for an empty package.json", () => {
    const packageJson: PackageJson = {};

    expect(detector.detect(packageJson)).toBe("unknown");
  });

    it("detects React using peerDependencies", () => {
    const packageJson: PackageJson = {
        peerDependencies: {
        react: "^19.0.0",
        },
    };

    expect(detector.detect(packageJson)).toBe("react");
    });

    it("detects React using optionalDependencies", () => {
    const packageJson: PackageJson = {
        optionalDependencies: {
        react: "^19.0.0",
        },
    };

    expect(detector.detect(packageJson)).toBe("react");
    });
});