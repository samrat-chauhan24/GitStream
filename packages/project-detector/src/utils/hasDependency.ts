import type { PackageJson } from "../models/PackageJson";

import { dependencyGroups } from "./dependencyGroups";

export function hasDependency(
  packageJson: PackageJson,
  dependency: string,
): boolean {
  return dependencyGroups(packageJson).some(
    dependencies => dependency in (dependencies ?? {}),
  );
}