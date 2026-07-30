import type { VirtualFileSystem } from "@gitstream/virtual-fs";

import { ENTRY_CANDIDATES } from "../constants/entryCandidates";
import type { EntryPoint } from "../models/EntryPoint";

export class EntryDetector {
  constructor(
    private readonly fs: VirtualFileSystem,
  ) {}

  detect(): EntryPoint {
    for (const candidate of ENTRY_CANDIDATES) {
      if (this.fs.exists(candidate)) {
        return candidate;
      }
    }

    throw new Error(
      "Unable to determine project entry point.",
    );
  }
}