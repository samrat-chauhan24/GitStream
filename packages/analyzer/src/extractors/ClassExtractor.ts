import ts from "typescript";

export class ClassExtractor {

  /**
   * Extracts all class declarations.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const classes: string[] = [];

    const visit = (
      node: ts.Node
    ): void => {

      if (
        ts.isClassDeclaration(node) &&
        node.name
      ) {
        classes.push(node.name.text);
      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return classes;

  }

}