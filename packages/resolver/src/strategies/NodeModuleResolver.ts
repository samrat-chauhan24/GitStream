import { ResolutionResult } from "../ResolutionResult";

/**
 * Resolves external package imports.
 */
export class NodeModuleResolver {

  resolve(): ResolutionResult {

    return {
      found: false,
      path: null,
    };

  }

}