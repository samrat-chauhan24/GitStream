import { ASTParser } from "./parser";
import {
  ImportExtractor,
  ExportExtractor,
  FunctionExtractor,
  ClassExtractor,
  VariableExtractor,
  InterfaceExtractor,
  TypeAliasExtractor,
  EnumExtractor,
} from "./extractors";
import { AnalysisResult } from "./models";

export class Analyzer {

  private readonly parser =
    new ASTParser();

  private readonly importExtractor =
    new ImportExtractor();

  private readonly exportExtractor =
    new ExportExtractor();

  private readonly functionExtractor =
    new FunctionExtractor();

  private readonly classExtractor =
    new ClassExtractor();

  private readonly variableExtractor =
    new VariableExtractor();

  private readonly interfaceExtractor =
    new InterfaceExtractor();

  private readonly typeAliasExtractor =
    new TypeAliasExtractor();

  private readonly enumExtractor =
    new EnumExtractor();

  /**
     * Analyzes a source file and extracts
     * its top-level declarations.
     */
  analyze(
    source: string
  ): AnalysisResult {

    const ast =
      this.parser.parse(source);

    return {

      imports:
        this.importExtractor.extract(ast),

      exports:
        this.exportExtractor.extract(ast),

      functions:
        this.functionExtractor.extract(ast),

      classes:
        this.classExtractor.extract(ast),

      variables:
        this.variableExtractor.extract(ast),

      interfaces:
        this.interfaceExtractor.extract(ast),

      typeAliases:
        this.typeAliasExtractor.extract(ast),

      enums:
        this.enumExtractor.extract(ast),

    };

  }

}