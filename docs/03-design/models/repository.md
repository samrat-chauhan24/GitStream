# Repository Specification

**Project:** GitStream

**Model:** Repository

**Version:** 1.0

**Status:** Draft

---

# Purpose

The Repository object is the central data model of GitStream.

It represents the complete state of a GitHub repository after retrieval by the GitHub Loader.

Every major subsystem receives the Repository object as input and may enrich specific sections according to its responsibilities.

The Repository itself never performs any operations.

It is purely a data model.

---

# Ownership

| Section | Owner |
|----------|-------|
| Identity | GitHub Loader |
| Source | GitHub Loader |
| Structure | GitHub Loader |
| Configuration | GitHub Loader |
| Dependencies | Resolver |
| Analysis | Analyzer |
| Capabilities | Analyzer |
| Cache | Cache Manager |

No package may modify sections owned by another package.

---

# Repository Structure

```
Repository
│
├── Identity
├── Source
├── Structure
├── Configuration
├── Dependencies
├── Analysis
├── Capabilities
└── Cache
```

---

# Identity

Describes the repository itself.

Fields

| Field | Description |
|--------|-------------|
| id | GitHub Repository ID |
| owner | Repository owner |
| name | Repository name |
| fullName | owner/repository |
| defaultBranch | Main branch |
| visibility | Public / Private |
| url | GitHub URL |
| cloneUrl | Clone URL |

Mutable

No

Owner

GitHub Loader

---

# Source

Describes where the repository came from.

Fields

| Field | Description |
|--------|-------------|
| provider | GitHub |
| apiVersion | REST API Version |
| commitHash | Current commit |
| retrievedAt | Download timestamp |
| etag | GitHub ETag |

Mutable

No

Owner

GitHub Loader

---

# Structure

Represents repository contents.

Fields

| Field | Description |
|--------|-------------|
| root | Root directory |
| directories | Directory collection |
| files | File map |
| entryFile | Main entry |
| packageJson | package.json |
| readme | README |

Mutable

No

Owner

GitHub Loader

---

# File Storage

Files are stored using a Map.

```
Map

key

↓

src/App.tsx

↓

RepositoryFile
```

Reason

O(1) lookup.

---

# RepositoryFile

Every source file contains:

| Field | Description |
|--------|-------------|
| path | Absolute repository path |
| name | File name |
| extension | File extension |
| content | File contents |
| size | File size |
| encoding | UTF-8 |
| sha | GitHub SHA |
| downloaded | Download timestamp |

RepositoryFile objects are immutable.

---

# Configuration

Contains project configuration.

Fields

| Field | Description |
|--------|-------------|
| packageManager | npm/pnpm/yarn |
| scripts | package scripts |
| tsconfig | tsconfig.json |
| viteConfig | vite.config.ts |
| tailwindConfig | tailwind.config |
| eslint | eslint config |
| prettier | prettier config |

Framework detection is intentionally excluded.

Analyzer determines framework later.

---

# Dependencies

Represents project dependencies.

Initially empty.

Later populated by the Resolver package.

Fields

| Field | Description |
|--------|-------------|
| dependencies | Runtime dependencies |
| devDependencies | Development dependencies |
| peerDependencies | Peer dependencies |
| optionalDependencies | Optional dependencies |

Mutable

Yes

Owner

Resolver

---

# Analysis

Represents repository analysis.

Initially empty.

Analyzer updates this section.

Fields

| Field | Description |
|--------|-------------|
| framework | React / Vue / Unknown |
| buildTool | Vite / CRA |
| warnings | Analysis warnings |
| errors | Analysis errors |
| compatibilityScore | Overall score |
| unsupportedFeatures | Unsupported features |
| entryPoints | Detected entry points |

Mutable

Yes

Owner

Analyzer

---

# Capabilities

Represents execution capabilities.

Fields

| Field | Description |
|--------|-------------|
| browserCompatible | Can execute in browser |
| requiresBackend | Backend required |
| requiresSecrets | Environment variables required |
| supportsSSR | Uses SSR |
| usesNodeApis | Uses Node.js APIs |
| usesDynamicImports | Dynamic imports detected |
| usesWasm | WebAssembly detected |

Mutable

Yes

Owner

Analyzer

Purpose

Provide a single source of truth for runtime decisions.

---

# Cache

Cache metadata.

Fields

| Field | Description |
|--------|-------------|
| cached | Cached locally |
| cacheKey | Cache identifier |
| lastUpdated | Last refresh |
| expiresAt | Cache expiration |

Mutable

Yes

Owner

Cache Manager

---

# Repository Lifecycle

```
Created

↓

Metadata Loaded

↓

Tree Downloaded

↓

Files Downloaded

↓

Repository Built

↓

Analyzed

↓

Dependencies Resolved

↓

Compiled

↓

Archived
```

The Repository itself is never executed.

Only consumed by downstream packages.

---

# Mutability Rules

Immutable

- Identity
- Source
- Structure
- Configuration

Mutable

- Dependencies
- Analysis
- Capabilities
- Cache

---

# Design Principles

- Single source of truth
- Immutable where possible
- Package ownership enforced
- No runtime state
- No compiler state
- No UI state

The Repository object contains only repository information.

---

# Future Extensions

Possible additions:

- Git submodules
- Git LFS
- Monorepo support
- Multiple entry points
- Workspace metadata
- Repository statistics