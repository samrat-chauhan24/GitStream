/**
 * Wraps a module inside an executable function.
 */
export class ModuleWrapper {

  /**
   * Wraps compiled source code.
   */
  wrap(
    id: string,
    code: string,
  ): string {

    return `
"${id}": function(module, exports, require) {
${code}
}
`.trim();

  }

}