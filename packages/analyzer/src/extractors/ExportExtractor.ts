import ts from "typescript";

export class ExportExtractor {

  /**
   * Extracts exported symbols.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const exports: string[] = [];

    const visit = (node: ts.Node): void => {

      // export default ...
      if (
        ts.isExportAssignment(node)
      ) {
        exports.push("default");
      }

      // export const ...
      if (
        (ts.isVariableStatement(node) ||
         ts.isFunctionDeclaration(node) ||
         ts.isClassDeclaration(node)) &&
        node.modifiers?.some(
          modifier =>
            modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {

        if (
          ts.isVariableStatement(node)
        ) {

          for (const declaration of node.declarationList.declarations) {

            if (
              ts.isIdentifier(declaration.name)
            ) {
              exports.push(declaration.name.text);
            }

          }

        } else if (
          node.name
        ) {

          exports.push(node.name.text);

        }

      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return exports;

  }

}