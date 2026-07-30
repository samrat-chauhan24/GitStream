import { ModuleTransformer } from "../src/ModuleTransformer";
import { beforeEach, describe, expect, it } from "vitest";


describe("ModuleTransformer", () => {
  let transformer: ModuleTransformer;

  beforeEach(() => {
    transformer = new ModuleTransformer();
  });

  const normalizeSpace = (str: string) => str.replace(/\s+/g, " ").trim();

  it("should transform side-effect import", () => {
    const source = `import "./foo";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`require("./foo");`));
  });

  it("should transform default import", () => {
    const source = `import Foo from "./foo";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const Foo = require("./foo").default;`));
  });

  it("should transform named import", () => {
    const source = `import { Foo } from "./foo";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const { Foo } = require("./foo");`));
  });

  it("should transform aliased named import", () => {
    const source = `import { Foo as Bar } from "./foo";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const { Foo: Bar } = require("./foo");`));
  });

  it("should transform namespace import", () => {
    const source = `import * as Utils from "./utils";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const Utils = require("./utils");`));
  });

  it("should transform mixed import", () => {
    const source = `import Foo, { Bar, Baz as Qux } from "./foo";`;
    const result = transformer.transform(source);
    
    expect(result).toMatch(/const __module(_\d+)? = require\("\.\/foo"\);/);
    expect(result).toMatch(/const Foo = __module(_\d+)?.default;/);
    expect(result).toMatch(/const { Bar, Baz: Qux } = __module(_\d+)?;/);
  });

  it("should transform default export", () => {
    const source = `export default Foo;`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = Foo;`));
  });

  it("should transform exported const", () => {
    const source = `export const VERSION = "1.0";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const VERSION = "1.0";`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.VERSION = VERSION;`));
  });

  it("should transform multiple exported const", () => {
    const source = `export const A = 1, B = 2;`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`const A = 1, B = 2;`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.A = A;`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.B = B;`));
  });

  it("should throw for unsupported destructuring exports", () => {
    const source1 = `export const {a} = obj;`;
    expect(() => transformer.transform(source1)).toThrow("Destructuring exports are not supported.");

    const source2 = `export const [x] = arr;`;
    expect(() => transformer.transform(source2)).toThrow("Destructuring exports are not supported.");
  });

  it("should transform exported function", () => {
    const source = `export function hello(){}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`function hello() { }`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.hello = hello;`));
  });

  it("should transform exported default function", () => {
    const source = `export default function hello(){}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`function hello() { }`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = hello;`));
  });

  it("should transform exported default async function", () => {
    const source = `export default async function hello(){}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`async function hello() { }`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = hello;`));
  });

  it("should transform anonymous default function", () => {
    const source = `export default function(){}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`function __default() { }`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = __default;`));
  });

  it("should transform exported class", () => {
    const source = `export class App{}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`class App {`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.App = App;`));
  });

  it("should transform exported default class", () => {
    const source = `export default class App {}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`class App {`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = App;`));
  });

  it("should transform anonymous default class", () => {
    const source = `export default class {}`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`class __default {`));
    expect(normalizeSpace(result)).toContain(normalizeSpace(`module.exports.default = __default;`));
  });

  it("should transform export list", () => {
    const source = `export { foo };`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.foo = foo;`));
  });

  it("should transform aliased export list", () => {
    const source = `export { foo as bar };`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`exports.bar = foo;`));
  });

  it("should transform re-export", () => {
    const source = `export { foo, bar as baz } from "./mod";`;
    const result = transformer.transform(source);
    
    expect(result).toMatch(/const __module(_\d+)? = require\("\.\/mod"\);/);
    expect(result).toMatch(/exports\.foo = __module(_\d+)?\.foo;/);
    expect(result).toMatch(/exports\.baz = __module(_\d+)?\.bar;/);
  });

  it("should transform export *", () => {
    const source = `export * from "./mod";`;
    const result = transformer.transform(source);
    expect(normalizeSpace(result)).toContain(normalizeSpace(`Object.assign(exports, require("./mod"));`));
  });
});