import { describe, expect, it } from "vitest";

import {
  Require,
} from "../src/Require";

import {
  ModuleCache,
} from "../src/ModuleCache";

describe("Require", () => {

  it("should load a module", () => {

    const runtime =
      new Require(
        {
          "/index.ts": (
            module,
          ) => {

            module.exports = {
              hello: "world",
            };

          },
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

    let count = 0;

    const runtime =
      new Require(
        {
          "/index.ts": (
            module,
          ) => {

            count++;

            module.exports = count;

          },
        },
        new ModuleCache(),
      );

    runtime.load("/index.ts");
    runtime.load("/index.ts");
    runtime.load("/index.ts");

    expect(count).toBe(1);

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
          "/a.ts": (
            module,
            exports,
            require,
          ) => {

            require("/b.ts");

            module.exports = "A";

          },

          "/b.ts": (
            module,
            exports,
            require,
          ) => {

            require("/a.ts");

            module.exports = "B";

          },
        },
        new ModuleCache(),
      );

    expect(
      runtime.load("/a.ts"),
    ).toBe("A");

  });

});