import type { VirtualFileSystem } from "@gitstream/virtual-fs";

import { BundlerDetector } from "./detectors/BundlerDetector";
import { EntryDetector } from "./detectors/EntryDetector";
import { FrameworkDetector } from "./detectors/FrameworkDetector";
import { LanguageDetector } from "./detectors/LanguageDetector";

import { PackageJsonLoader } from "./loaders/PackageJsonLoader";

import type { ProjectInfo } from "./models/ProjectInfo";

export class ProjectDetector {
  constructor(
    private readonly fs: VirtualFileSystem,
  ) {}

  detect(): ProjectInfo {
    const packageJson =
      new PackageJsonLoader(this.fs).load();

    const framework =
      new FrameworkDetector().detect(packageJson);

    const bundler =
      new BundlerDetector().detect(packageJson);

    const entry =
      new EntryDetector(this.fs).detect();

    const language =
      new LanguageDetector().detect(entry);

    return {
      framework,
      bundler,
      language,
      entry,
      packageJsonPath: "/package.json",
    };
  }
}