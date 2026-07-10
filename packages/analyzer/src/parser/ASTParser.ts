import ts from "typescript";

export class ASTParser {

  /**
   * Parses source code into a TypeScript SourceFile.
   */
  parse(source: string): ts.SourceFile {

    return ts.createSourceFile(
      "file.ts",
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

  }

}