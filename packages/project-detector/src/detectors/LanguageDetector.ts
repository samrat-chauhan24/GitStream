import type { EntryPoint } from "../models/EntryPoint";
import type { Language } from "../models/Language";

export class LanguageDetector {
  detect(entry: EntryPoint): Language {
    return entry.endsWith(".tsx")
      ? "ts"
      : "js";
  }
}