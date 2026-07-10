import ts from "typescript";

export class TypeAliasExtractor {

  /**
   * Extracts type alias declarations.
   */
  extract(
    sourceFile: ts.SourceFile
  ): string[] {

    const aliases: string[] = [];

    const visit = (node: ts.Node): void => {

      if (ts.isTypeAliasDeclaration(node)) {
        aliases.push(node.name.text);
      }

      ts.forEachChild(node, visit);

    };

    visit(sourceFile);

    return aliases;

  }

}