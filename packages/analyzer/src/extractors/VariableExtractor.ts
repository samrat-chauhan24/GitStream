import ts from "typescript";

export class VariableExtractor {

  /**
   * Extracts top-level variable declarations.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const variables: string[] = [];

    const visit = (node: ts.Node): void => {

      if (ts.isVariableStatement(node)) {

        for (const declaration of node.declarationList.declarations) {

          if (ts.isIdentifier(declaration.name)) {
            variables.push(
              declaration.name.text
            );
          }

        }

      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return variables;

  }

}