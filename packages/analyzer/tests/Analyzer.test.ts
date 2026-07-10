import { describe, expect, it } from "vitest";
import { Analyzer } from "../src";

describe("Analyzer", () => {

  it("extracts a single import", () => {

    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      import React from "react";
    `);

    expect(result.imports).toEqual([
      "react"
    ]);

  });

  it("extracts multiple imports", () => {

    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      import React from "react";
      import Button from "./Button";
      import "./styles.css";
    `);

    expect(result.imports).toEqual([
      "react",
      "./Button",
      "./styles.css"
    ]);

  });

  it("extracts a default export", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export default App;
    `);

    expect(result.exports).toEqual([
      "default"
    ]);
  });

  it("extracts named exports", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export const count = 1;
      export function hello() {}
    `);

    expect(result.exports).toEqual([
      "count",
      "hello"
    ]);
  });

  it("extracts function declarations", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      function add() {}
    `);

    expect(result.functions).toEqual([
      "add"
    ]);
  });

  it("extracts exported functions", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export function hello() {}
    `);

    expect(result.functions).toEqual([
      "hello"
    ]);
  });

  it("extracts arrow functions", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      const greet = () => {};
    `);

    expect(result.functions).toEqual([
      "greet"
    ]);
  });

  it("extracts multiple functions", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      function one() {}

      const two = () => {};

      export function three() {}
    `);

    expect(result.functions).toEqual([
      "one",
      "two",
      "three"
    ]);
  });

  it("extracts class declarations", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      class User {}
    `);

    expect(result.classes).toEqual([
      "User"
    ]);
  });

  it("extracts exported classes", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export class Product {}
    `);

    expect(result.classes).toEqual([
      "Product"
    ]);
  });

  it("extracts multiple classes", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      class A {}
      class B {}
      export class C {}
    `);

    expect(result.classes).toEqual([
      "A",
      "B",
      "C"
    ]);
  });  

  it("extracts const declarations", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      const count = 1;
    `);

    expect(result.variables).toEqual([
      "count"
    ]);
  });

  it("extracts let declarations", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      let total = 0;
    `);

    expect(result.variables).toEqual([
      "total"
    ]);
  });

  it("extracts multiple variables", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      const a = 1;
      let b = 2;
      const c = () => {};
    `);

    expect(result.variables).toEqual([
      "a",
      "b",
      "c"
    ]);
  });

  it("extracts exported variables", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export const version = "1.0";
    `);

    expect(result.variables).toEqual([
      "version"
    ]);
  });

  it("extracts interfaces", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      interface User {}
    `);

    expect(result.interfaces).toEqual([
      "User"
    ]);
  });

  it("extracts exported interfaces", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export interface Product {}
    `);

    expect(result.interfaces).toEqual([
      "Product"
    ]);
  });

  it("extracts multiple interfaces", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      interface A {}
      interface B {}
      export interface C {}
    `);

    expect(result.interfaces).toEqual([
      "A",
      "B",
      "C"
    ]);
  });

  it("extracts type aliases", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      type User = {
        id: number;
      };
    `);

    expect(result.typeAliases).toEqual([
      "User"
    ]);
  });

  it("extracts exported type aliases", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export type Product = {
        name: string;
      };
    `);

    expect(result.typeAliases).toEqual([
      "Product"
    ]);
  });

  it("extracts multiple type aliases", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      type A = string;
      type B = number;
      export type C = boolean;
    `);

    expect(result.typeAliases).toEqual([
      "A",
      "B",
      "C"
    ]);
  });

  it("extracts enums", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      enum Color {
        Red,
        Blue
      }
    `);

    expect(result.enums).toEqual([
      "Color"
    ]);
  });

  it("extracts exported enums", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      export enum Status {
        Active,
        Inactive
      }
    `);

    expect(result.enums).toEqual([
      "Status"
    ]);
  });

  it("extracts multiple enums", () => {
    const analyzer = new Analyzer();

    const result = analyzer.analyze(`
      enum A {}
      enum B {}
      export enum C {}
    `);

    expect(result.enums).toEqual([
      "A",
      "B",
      "C"
    ]);
  });

});