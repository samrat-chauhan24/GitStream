import type { Bundler } from "./Bundler";
import type { Framework } from "./Framework";
import type { Language } from "./Language";

export interface ProjectInfo {
  framework: Framework;

  bundler: Bundler;

  language: Language;

  entry: string;

  packageJsonPath: string;
}