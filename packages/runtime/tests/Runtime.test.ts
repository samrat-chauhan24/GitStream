import { describe, expect, it } from "vitest";

import { Runtime } from "../src/Runtime";

describe("Runtime", () => {

  it("should execute the entry module", () => {

    const runtime =
      new Runtime(
        {
          "/index.ts": (
            module,
          ) => {

            module.exports = {
              message: "Hello GitStream",
            };

          },
        },
      );

    expect(
      runtime.run("/index.ts"),
    ).toEqual({
      message: "Hello GitStream",
    });

  });

  it("should reuse cached modules", () => {

    let count = 0;

    const runtime =
      new Runtime(
        {
          "/index.ts": (
            module,
          ) => {

            count++;

            module.exports = count;

          },
        },
      );

    runtime.run("/index.ts");
    runtime.run("/index.ts");

    expect(count).toBe(1);

  });

  it("should reset the cache", () => {

    let count = 0;

    const runtime =
      new Runtime(
        {
          "/index.ts": (
            module,
          ) => {

            count++;

            module.exports = count;

          },
        },
      );

    runtime.run("/index.ts");

    runtime.reset();

    runtime.run("/index.ts");

    expect(count).toBe(2);

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