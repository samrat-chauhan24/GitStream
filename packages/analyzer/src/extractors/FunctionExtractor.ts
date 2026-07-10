import ts from "typescript";

export class FunctionExtractor {

  /**
   * Extracts all top-level function declarations
   * and arrow functions assigned to variables.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const functions: string[] = [];

    const visit = (node: ts.Node): void => {

      // function hello() {}
      if (
        ts.isFunctionDeclaration(node) &&
        node.name
      ) {
        functions.push(node.name.text);
      }

      // const hello = () => {}
      if (
        ts.isVariableStatement(node)
      ) {

        for (const declaration of node.declarationList.declarations) {

          if (
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            ts.isArrowFunction(declaration.initializer)
          ) {

            functions.push(
              declaration.name.text
            );

          }

        }

      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return functions;

  }

}