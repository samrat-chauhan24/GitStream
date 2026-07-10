import ts from "typescript";

export class EnumExtractor {

  /**
   * Extracts enum declarations.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const enums: string[] = [];

    const visit = (node: ts.Node): void => {

      if (ts.isEnumDeclaration(node)) {
        enums.push(node.name.text);
      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return enums;

  }

}