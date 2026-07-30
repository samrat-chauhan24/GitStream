import { describe, expect, it } from "vitest";

import type { PackageJson } from "../src/models/PackageJson";
import { hasDependency } from "../src/utils/hasDependency";

describe("hasDependency", () => {
  it("returns true for dependencies", () => {
    const packageJson: PackageJson = {
      dependencies: {
        react: "^19.0.0",
      },
    };

    expect(hasDependency(packageJson, "react")).toBe(true);
  });

  it("returns true for devDependencies", () => {
    const packageJson: PackageJson = {
      devDependencies: {
        vite: "^7.0.0",
      },
    };

    expect(hasDependency(packageJson, "vite")).toBe(true);
  });

  it("returns false when dependency is absent", () => {
    const packageJson: PackageJson = {};

    expect(hasDependency(packageJson, "react")).toBe(false);
  });
});