# ADR-0005: iframe-based Runtime Sandbox

## Status

Accepted

---

## Context

Compiled applications must execute safely without affecting the GitStream application itself.

---

## Decision

GitStream will execute compiled applications inside a sandboxed iframe.

The runtime communicates using postMessage.

---

## Consequences

### Advantages

- Runtime isolation
- Security
- Crash containment
- Browser-native

### Disadvantages

- Cross-origin communication complexity
- iframe limitations

---

## Alternatives Considered

### Direct DOM Injection

Rejected because runtime failures could crash GitStream.

### WebContainers

Deferred due to complexity and additional browser requirements.