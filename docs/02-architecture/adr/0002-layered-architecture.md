# ADR-0002: Layered Architecture

## Status

Accepted

---

## Context

GitStream consists of multiple independent responsibilities including repository retrieval, analysis, compilation, runtime execution, and caching.

A clear separation of concerns is required.

---

## Decision

GitStream will use a layered architecture.

Presentation

↓

Runtime

↓

Compilation

↓

Analysis

↓

Infrastructure

Each layer may communicate only with adjacent layers.

---

## Consequences

### Advantages

- Clear separation of concerns
- Easier testing
- Easier maintenance
- Components remain replaceable

### Disadvantages

- Additional abstraction
- Slightly more boilerplate

---

## Alternatives Considered

### Monolithic Architecture

Rejected because responsibilities become tightly coupled.

### Microservices

Rejected because GitStream is browser-only.