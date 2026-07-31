import ts from "typescript";

/**
 * Responsible for transpiling source code
 * into executable JavaScript.
 */
export class Transpiler {

  /**
   * Transpiles a source file into
   * executable JavaScript.
   */
  transpile(
    source: string,
    filePath: string,
  ): string {

    const result =
      ts.transpileModule(
        source,
        {
          fileName: filePath,
          compilerOptions: {

            target:
              ts.ScriptTarget.ES2022,

            module:
              ts.ModuleKind.ESNext,

            // Use the classic React transform
            jsx:
              ts.JsxEmit.React,

            allowJs: true,

            esModuleInterop: true,

          },
        },
      );

    return result.outputText;

  }

}