import ts from "typescript";

export class ImportExtractor {

  /**
   * Extracts every import specifier.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const imports: string[] = [];

    const visit = (
      node: ts.Node
    ): void => {

      if (
        ts.isImportDeclaration(node)
      ) {

        imports.push(
          (
            node.moduleSpecifier as ts.StringLiteral
          ).text
        );

      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return imports;

  }

}