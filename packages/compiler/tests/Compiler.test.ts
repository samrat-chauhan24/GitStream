import { beforeEach, describe, expect, it } from "vitest";

import { Runtime } from "@gitStream/runtime";

describe("Runtime", () => {

  beforeEach(() => {
    (globalThis as any).__count = 0;
  });

  it("should execute the entry module", () => {

    const runtime =
      new Runtime({
        "/index.ts": `
module.exports = {
  message: "Hello GitStream",
};
`,
      });

    expect(
      runtime.run("/index.ts"),
    ).toEqual({
      message: "Hello GitStream",
    });

  });

  it("should reuse cached modules", () => {

    const runtime =
      new Runtime({
        "/index.ts": `
globalThis.__count++;

module.exports =
  globalThis.__count;
`,
      });

    runtime.run("/index.ts");
    runtime.run("/index.ts");

    expect(
      (globalThis as any).__count,
    ).toBe(1);

  });

  it("should reset the cache", () => {

    const runtime =
      new Runtime({
        "/index.ts": `
globalThis.__count++;

module.exports =
  globalThis.__count;
`,
      });

    runtime.run("/index.ts");

    runtime.reset();

    runtime.run("/index.ts");

    expect(
      (globalThis as any).__count,
    ).toBe(2);

  });

  it("should throw for missing entry", () => {

    const runtime =
      new Runtime({});

    expect(() =>
      runtime.run("/missing.ts"),
    ).toThrow(
      'Cannot find module "/missing.ts"',
    );

  });

});