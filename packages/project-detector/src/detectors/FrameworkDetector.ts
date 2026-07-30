import type { Framework } from "../models/Framework";
import type { PackageJson } from "../models/PackageJson";

import { hasDependency } from "../utils/hasDependency";

export class FrameworkDetector {
  detect(packageJson: PackageJson): Framework {
    return hasDependency(packageJson, "react")
      ? "react"
      : "unknown";
  }
}