# ADR-0001: Browser-First Architecture

## Status

Accepted

---

## Context

GitStream is intended to execute compatible GitHub repositories directly inside a user's browser without requiring a traditional backend server.

The primary objective is to demonstrate browser-native execution, client-side compilation, and modern web platform capabilities rather than traditional application hosting.

---

## Decision

GitStream will adopt a browser-first architecture.

All major execution stages—including repository retrieval, dependency resolution, compilation, and runtime execution—will occur entirely within the browser whenever technically feasible.

No dedicated backend service will be required for the core runtime.

---

## Consequences

### Advantages

- Zero infrastructure costs
- Easy deployment
- Privacy-friendly
- Demonstrates browser engineering
- Fully client-side execution

### Disadvantages

- Limited by browser capabilities
- Cannot securely store secrets
- Cannot execute server-side code
- GitHub API rate limits

---

## Alternatives Considered

### Traditional Backend

Rejected because it moves execution away from the browser and reduces the educational value of the project.

### Hybrid Architecture

Deferred for future versions.