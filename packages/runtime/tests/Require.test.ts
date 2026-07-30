import { beforeEach, describe, expect, it } from "vitest";

import { ModuleCache } from "../src/ModuleCache";
import { Require } from "../src/Require";

describe("Require", () => {

  beforeEach(() => {
    (globalThis as any).__count = 0;
  });

  it("should load a module", () => {

    const runtime =
      new Require(
        {
          "/index.ts": `
module.exports = {
  hello: "world",
};
`,
        },
        new ModuleCache(),
      );

    expect(
      runtime.load("/index.ts"),
    ).toEqual({
      hello: "world",
    });

  });

  it("should cache executed modules", () => {

    const runtime =
      new Require(
        {
          "/index.ts": `
globalThis.__count++;

module.exports =
  globalThis.__count;
`,
        },
        new ModuleCache(),
      );

    runtime.load("/index.ts");
    runtime.load("/index.ts");
    runtime.load("/index.ts");

    expect(
      (globalThis as any).__count,
    ).toBe(1);

  });

  it("should throw for missing modules", () => {

    const runtime =
      new Require(
        {},
        new ModuleCache(),
      );

    expect(() =>
      runtime.load("/missing.ts"),
    ).toThrow(
      'Cannot find module "/missing.ts"',
    );

  });

  it("should support circular dependencies", () => {

    const runtime =
      new Require(
        {
          "/a.ts": `
require("/b.ts");

module.exports = "A";
`,

          "/b.ts": `
require("/a.ts");

module.exports = "B";
`,
        },
        new ModuleCache(),
      );

    expect(
      runtime.load("/a.ts"),
    ).toBe("A");

  });

});