import ts from "typescript";

export class InterfaceExtractor {

  /**
   * Extracts interface declarations.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const interfaces: string[] = [];

    const visit = (node: ts.Node): void => {

      if (
        ts.isInterfaceDeclaration(node)
      ) {
        interfaces.push(node.name.text);
      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return interfaces;

  }

}