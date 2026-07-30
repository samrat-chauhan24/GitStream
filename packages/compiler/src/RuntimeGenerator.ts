/**
 * Generates the final executable runtime bundle.
 */
export class RuntimeGenerator {

  /**
   * Generates a runtime bundle.
   */
  generate(
    entry: string,
    modules: string[],
  ): string {

    return `
(function() {

const modules = {

${modules.join(",\n\n")}

};

const cache = {};

function require(id) {

  if (cache[id]) {
    return cache[id].exports;
  }

  const module = {
    exports: {}
  };

  cache[id] = module;

  modules[id](
    module,
    module.exports,
    require
  );

  return module.exports;

}

require("${entry}");

})();
`.trim();

  }

}