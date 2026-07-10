export interface AnalysisResult {
  imports: string[];
  exports: string[];
  functions: string[];
  classes: string[];
  variables: string[];
  interfaces: string[];
  typeAliases: string[];
  enums: string[];
}