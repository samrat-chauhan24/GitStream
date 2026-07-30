import type { PackageJson } from "../models/PackageJson";

export function dependencyGroups(packageJson: PackageJson) {
  return [
    packageJson.dependencies,
    packageJson.devDependencies,
    packageJson.peerDependencies,
    packageJson.optionalDependencies,
  ];
}