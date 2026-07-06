# ADR-0004: IndexedDB Repository Cache

## Status

Accepted

---

## Context

GitHub limits unauthenticated API requests.

Repositories should not be downloaded repeatedly.

---

## Decision

GitStream will cache repository metadata, source files, and compiled bundles using IndexedDB.

---

## Consequences

### Advantages

- Faster reloads
- Reduced GitHub API usage
- Offline-friendly

### Disadvantages

- Browser storage limits
- Cache invalidation complexity

---

## Alternatives Considered

### LocalStorage

Rejected due to size limitations.

### Memory Cache

Rejected because data disappears after refresh.

### OPFS

Deferred for future versions.