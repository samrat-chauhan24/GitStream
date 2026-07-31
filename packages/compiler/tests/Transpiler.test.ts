import { describe, expect, it } from "vitest";

import { Transpiler } from "../src/Transpiler";

describe("Transpiler", () => {

  const transpiler =
    new Transpiler();

  it("transpiles JSX", () => {

    const output =
      transpiler.transpile(
        `
export function App() {
  return <h1>Hello</h1>;
}
`,
        "/App.jsx",
      );

    expect(output).not.toContain("<h1>");
    expect(output).toContain("_jsx");

  });

  it("transpiles TSX", () => {

    const output =
      transpiler.transpile(
        `
type Props = {
  name: string;
};

export function App(
  props: Props,
) {
  return <h1>{props.name}</h1>;
}
`,
        "/App.tsx",
      );

    expect(output).toContain("_jsx");

  });

});