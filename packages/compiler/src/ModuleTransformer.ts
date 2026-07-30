import ts from "typescript";

/**
 * Transforms ES Modules into a CommonJS-compatible format.
 *
 * Supported:
 *  - import "./foo"
 *  - import Foo from "./foo"
 *  - import { Foo } from "./foo"
 *  - export default Foo
 */
export class ModuleTransformer {

  transform(
    source: string,
  ): string {

    const sourceFile = ts.createSourceFile(
      "module.ts",
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    const printer = ts.createPrinter();

    const transformer =
      <T extends ts.Node>(
        context: ts.TransformationContext,
      ) => {

        const visit: ts.Visitor = (
          node,
        ) => {

          if (ts.isImportDeclaration(node)) {
            return this.handleImportDeclaration(node);
          }

          if (ts.isExportAssignment(node)) {
            return this.handleExportAssignment(node);
          }

          if (ts.isVariableStatement(node) && this.hasExportModifier(node)) {
            return this.handleVariableExport(node);
          }

          if (ts.isFunctionDeclaration(node) && this.hasExportModifier(node)) {
            return this.handleFunctionExport(node);
          }

          if (ts.isClassDeclaration(node) && this.hasExportModifier(node)) {
            return this.handleClassExport(node);
          }

          if (ts.isExportDeclaration(node)) {
            return this.handleExportDeclaration(node);
          }

          return ts.visitEachChild(
            node,
            visit,
            context,
          );

        };

        return (
          node: T,
        ) =>
          ts.visitNode(
            node,
            visit,
          ) as T;

      };

    const result =
      ts.transform(
        sourceFile,
        [
          transformer,
        ],
      );

    const transformed =
      result.transformed[0];

    const output =
      printer.printFile(
        transformed as ts.SourceFile,
      );

    result.dispose();

    return output;

  }

  // ==========================================
  // Import Helpers
  // ==========================================

  private handleImportDeclaration(node: ts.ImportDeclaration): ts.Node | ts.Node[] {
    const specifier = node.moduleSpecifier;

    // import "./foo"
    if (!node.importClause) {
      return ts.factory.createExpressionStatement(
        this.createRequireCall(specifier)
      );
    }

    const { name, namedBindings } = node.importClause;

    // import Foo from "./foo" (Default only)
    if (name && !namedBindings) {
      return this.createConst(
        name,
        ts.factory.createPropertyAccessExpression(this.createRequireCall(specifier), "default")
      );
    }

    // import * as Utils from "./utils" (Namespace only)
    if (!name && namedBindings && ts.isNamespaceImport(namedBindings)) {
      return this.createConst(namedBindings.name, this.createRequireCall(specifier));
    }

    // import { Foo, Bar as Baz } from "./foo" (Named only)
    if (!name && namedBindings && ts.isNamedImports(namedBindings)) {
      return this.createDestructuredRequire(namedBindings, specifier);
    }

    // import Foo, { Bar, Baz as Qux } from "./foo" (Mixed)
    if (name && namedBindings) {
      const modId = ts.factory.createUniqueName("__module");
      const stmts: ts.Statement[] = [];

      // const __module = require("./foo");
      stmts.push(this.createConst(modId, this.createRequireCall(specifier)));

      // const Foo = __module.default;
      stmts.push(this.createConst(name, ts.factory.createPropertyAccessExpression(modId, "default")));

      // const { Bar, Baz: Qux } = __module;
      if (ts.isNamedImports(namedBindings)) {
        stmts.push(this.createConst(this.createObjectBindingPattern(namedBindings), modId));
      }

      return stmts;
    }

    return node;
  }

  private createRequireCall(specifier: ts.Expression): ts.CallExpression {
    return ts.factory.createCallExpression(
      ts.factory.createIdentifier("require"),
      undefined,
      [specifier]
    );
  }

  private createObjectBindingPattern(namedBindings: ts.NamedImports): ts.ObjectBindingPattern {
    return ts.factory.createObjectBindingPattern(
      namedBindings.elements.map(element =>
        ts.factory.createBindingElement(
          undefined,
          element.propertyName,
          element.name,
          undefined
        )
      )
    );
  }

  private createDestructuredRequire(namedBindings: ts.NamedImports, specifier: ts.Expression): ts.VariableStatement {
    return this.createConst(
      this.createObjectBindingPattern(namedBindings),
      this.createRequireCall(specifier)
    );
  }

  // ==========================================
  // Export Helpers
  // ==========================================

  private handleExportAssignment(node: ts.ExportAssignment): ts.Node {
    // export default Foo;
    if (!node.isExportEquals) {
      return this.createModuleExportsAssignment(node.expression);
    }
    return node;
  }

  private handleVariableExport(node: ts.VariableStatement): ts.Node[] {
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) {
        throw new Error("Destructuring exports are not supported.");
      }
    }

    const updatedNode = ts.factory.updateVariableStatement(
      node,
      this.removeExportModifier(node),
      node.declarationList
    );

    const exportAssignments = node.declarationList.declarations.map((decl) =>
      this.createExportAssignment((decl.name as ts.Identifier).text, decl.name as ts.Identifier)
    );

    return [updatedNode, ...exportAssignments];
  }

  private handleFunctionExport(node: ts.FunctionDeclaration): ts.Node[] {
    const isDefault = this.hasDefaultModifier(node);
    const name = node.name || (isDefault ? ts.factory.createIdentifier("__default") : undefined);

    if (!name) return [node];

    const updatedNode = ts.factory.updateFunctionDeclaration(
      node,
      this.removeExportAndDefaultModifiers(node),
      node.asteriskToken,
      name,
      node.typeParameters,
      node.parameters,
      node.type,
      node.body
    );

    if (isDefault) {
      return [updatedNode, this.createModuleExportsAssignment(name)];
    }

    return [updatedNode, this.createExportAssignment(name.text, name)];
  }

  private handleClassExport(node: ts.ClassDeclaration): ts.Node[] {
    const isDefault = this.hasDefaultModifier(node);
    const name = node.name || (isDefault ? ts.factory.createIdentifier("__default") : undefined);

    if (!name) return [node];

    const updatedNode = ts.factory.updateClassDeclaration(
      node,
      this.removeExportAndDefaultModifiers(node),
      name,
      node.typeParameters,
      node.heritageClauses,
      node.members
    );

    if (isDefault) {
      return [updatedNode, this.createModuleExportsAssignment(name)];
    }

    return [updatedNode, this.createExportAssignment(name.text, name)];
  }

  private handleExportDeclaration(node: ts.ExportDeclaration): ts.Node | ts.Node[] {
    // export * from "./mod";
    if (node.moduleSpecifier && !node.exportClause) {
      return ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("Object"),
            "assign"
          ),
          undefined,
          [
            ts.factory.createIdentifier("exports"),
            this.createRequireCall(node.moduleSpecifier)
          ]
        )
      );
    }

    // export { foo, bar as baz } from "./mod";
    if (node.moduleSpecifier && node.exportClause && ts.isNamedExports(node.exportClause)) {
      const modId = ts.factory.createUniqueName("__module");
      const stmts: ts.Statement[] = [];

      stmts.push(this.createConst(modId, this.createRequireCall(node.moduleSpecifier)));

      for (const element of node.exportClause.elements) {
        const localName = element.propertyName ?? element.name;

            const access =
                ts.isIdentifier(localName)
                    ? ts.factory.createPropertyAccessExpression(
                        modId,
                        localName,
                    )
                    : ts.factory.createElementAccessExpression(
                        modId,
                        localName,
                    );

            stmts.push(
                this.createExportAssignment(
                    element.name.text,
                    access,
                ),
            );
      }

      return stmts;
    }

    // export { foo, foo as bar };
    if (!node.moduleSpecifier && node.exportClause && ts.isNamedExports(node.exportClause)) {
      const stmts: ts.Statement[] = [];
      for (const element of node.exportClause.elements) {
        const localName = element.propertyName || element.name;
        const exportName = element.name;
        
        stmts.push(this.createExportAssignment(exportName.text, localName));
      }
      return stmts;
    }

    return node;
  }

  // ==========================================
  // AST Helpers
  // ==========================================

  private createConst(name: string | ts.BindingPattern | ts.Identifier, value: ts.Expression): ts.VariableStatement {
    const nameNode = typeof name === "string" ? ts.factory.createIdentifier(name) : name;
    return ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            nameNode,
            undefined,
            undefined,
            value
          )
        ],
        ts.NodeFlags.Const
      )
    );
  }

  private createAssignment(left: ts.Expression, right: ts.Expression): ts.ExpressionStatement {
    return ts.factory.createExpressionStatement(
      ts.factory.createBinaryExpression(
        left,
        ts.SyntaxKind.EqualsToken,
        right
      )
    );
  }

  private createModuleExportsAssignment(value: ts.Expression): ts.ExpressionStatement {
    return this.createAssignment(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("module"),
          "exports"
        ),
        "default"
      ),
      value
    );
  }

  private createExportAssignment(exportName: string, value: ts.Expression): ts.ExpressionStatement {
    return this.createAssignment(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("exports"),
        exportName
      ),
      value
    );
  }

  // ==========================================
  // Modifier Helpers
  // ==========================================

  private getModifiers(node: ts.Node): readonly ts.ModifierLike[] | undefined {
    return ts.canHaveModifiers(node) ? ts.getModifiers(node) : (node as any).modifiers;
  }

  private hasExportModifier(node: ts.Node): boolean {
    const modifiers = this.getModifiers(node);
    if (!modifiers) return false;
    return modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
  }

  private hasDefaultModifier(node: ts.Node): boolean {
    const modifiers = this.getModifiers(node);
    if (!modifiers) return false;
    return modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);
  }

  private removeExportModifier(node: ts.Node): readonly ts.ModifierLike[] | undefined {
    const modifiers = this.getModifiers(node);
    if (!modifiers) return undefined;
    
    const filtered = modifiers.filter(m => m.kind !== ts.SyntaxKind.ExportKeyword);
    return filtered.length > 0 ? filtered : undefined;
  }

  private removeExportAndDefaultModifiers(node: ts.Node): readonly ts.ModifierLike[] | undefined {
    const modifiers = this.getModifiers(node);
    if (!modifiers) return undefined;
    
    const filtered = modifiers.filter(m => m.kind !== ts.SyntaxKind.ExportKeyword && m.kind !== ts.SyntaxKind.DefaultKeyword);
    return filtered.length > 0 ? filtered : undefined;
  }

}