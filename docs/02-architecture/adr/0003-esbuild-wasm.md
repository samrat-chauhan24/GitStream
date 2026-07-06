# ADR-0003: esbuild-wasm as Browser Compiler

## Status

Accepted

---

## Context

GitStream requires an in-browser compiler capable of compiling TypeScript, JSX, and modern JavaScript.

---

## Decision

GitStream will use esbuild-wasm as the primary browser compiler.

---

## Consequences

### Advantages

- Fast compilation
- WebAssembly
- Browser compatible
- Mature ecosystem

### Disadvantages

- Bundle size
- Limited plugin ecosystem compared to Node.js

---

## Alternatives Considered

### Babel

Rejected because it does not bundle projects.

### SWC

Deferred for future evaluation.

### Webpack

Rejected due to browser complexity.