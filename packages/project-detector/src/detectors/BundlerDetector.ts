import type { Bundler } from "../models/Bundler";
import type { PackageJson } from "../models/PackageJson";

import { hasDependency } from "../utils/hasDependency";

export class BundlerDetector {
  detect(packageJson: PackageJson): Bundler {
    if (hasDependency(packageJson, "vite")) {
      return "vite";
    }

    if (hasDependency(packageJson, "react-scripts")) {
      return "cra";
    }

    return "unknown";
  }
}