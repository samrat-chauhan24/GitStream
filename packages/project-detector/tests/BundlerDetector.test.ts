import { describe, expect, it } from "vitest";

import { BundlerDetector } from "../src/detectors/BundlerDetector";
import type { PackageJson } from "../src/models/PackageJson";

describe("BundlerDetector", () => {
  const detector = new BundlerDetector();

  it("detects Vite using dependencies", () => {
    const packageJson: PackageJson = {
      dependencies: {
        vite: "^7.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("vite");
  });

  it("detects Vite using devDependencies", () => {
    const packageJson: PackageJson = {
      devDependencies: {
        vite: "^7.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("vite");
  });

  it("detects CRA using react-scripts", () => {
    const packageJson: PackageJson = {
      dependencies: {
        "react-scripts": "^5.0.1",
      },
    };

    expect(detector.detect(packageJson)).toBe("cra");
  });

  it("prefers Vite when both Vite and CRA are present", () => {
    const packageJson: PackageJson = {
      dependencies: {
        vite: "^7.0.0",
        "react-scripts": "^5.0.1",
      },
    };

    expect(detector.detect(packageJson)).toBe("vite");
  });

  it("returns unknown for unrelated bundlers", () => {
    const packageJson: PackageJson = {
      dependencies: {
        webpack: "^5.0.0",
        rollup: "^4.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("unknown");
  });

  it("returns unknown for an empty package.json", () => {
    const packageJson: PackageJson = {};

    expect(detector.detect(packageJson)).toBe("unknown");
  });

  it("detects Vite from peerDependencies", () => {
    const packageJson: PackageJson = {
      peerDependencies: {
        vite: "^7.0.0",
      },
    };

    expect(detector.detect(packageJson)).toBe("vite");
  });

  it("detects CRA from optionalDependencies", () => {
    const packageJson: PackageJson = {
      optionalDependencies: {
        "react-scripts": "^5.0.1",
      },
    };

    expect(detector.detect(packageJson)).toBe("cra");
  });
});