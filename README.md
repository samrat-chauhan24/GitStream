# GitStream

> Browser-native execution engine for GitHub repositories.

GitStream is an open-source collection of packages that can download, analyze, resolve, compile and execute public GitHub repositories entirely in the browser.

The long-term goal is to make running GitHub projects inside portfolios, documentation, playgrounds and developer tools as simple as:

```ts
const runtime = new Runtime();

await runtime.run(
  "https://github.com/facebook/react"
);
```

---

# Vision

GitStream aims to become the browser equivalent of Node.js for GitHub repositories.

Instead of cloning a project, installing dependencies, and running a development server, GitStream will:

- Download repositories directly from GitHub
- Build an in-memory virtual filesystem
- Analyze source code
- Resolve imports
- Build dependency graphs
- Compile projects
- Execute them inside a secure browser sandbox

Everything happens client-side.

No backend required.

---

# Architecture

```
GitHub Repository
        │
        ▼
github-loader
        │
        ▼
virtual-fs
        │
        ▼
analyzer
        │
        ▼
resolver
        │
        ▼
dependency-graph
        │
        ▼
compiler
        │
        ▼
runtime
```

Every package has a single responsibility and can be used independently.

---

# Packages

## ✅ github-loader

Downloads repositories directly from GitHub.

Features:

- URL parsing
- GitHub REST API client
- Repository tree fetching
- File downloading
- Repository building
- Authentication via GitHub Token

Status:

```
v1 Complete
```

---

## ✅ virtual-fs

A fully in-memory virtual filesystem.

Features:

- mkdir()
- writeFile()
- readFile()
- exists()
- list()
- readDirectory()
- delete()
- move()
- copy()
- rename()
- clear()
- walk()
- find()
- stat()

Status:

```
v1 Complete
```

---

## ✅ analyzer

Static source code analyzer powered by the TypeScript Compiler API.

Extracts:

- Imports
- Exports
- Functions
- Classes
- Variables
- Interfaces
- Type Aliases
- Enums

Status:

```
v1 Complete
```

---

## ✅ resolver

Resolves module import specifiers into actual files inside the Virtual File System.

Supports:

- Relative imports
- Absolute imports
- Extensionless imports
- Directory index resolution
- TypeScript and JavaScript files

Example:

```ts
resolve(
    "/src/App.ts",
    "./Button"
);
```

↓

```
/src/Button.ts
```

Status:

```
v1 Complete
```

---

## ✅ dependency-graph

Builds a complete dependency graph by recursively traversing project source files.

Features:

- Recursive dependency traversal
- Circular dependency detection
- Duplicate dependency prevention
- Resolver integration
- Analyzer integration
- Graph generation from a single entry file

Example:

```ts
const graph = dependencyGraph.build(
    "/src/App.ts"
);
```

↓

```
App.ts
 ├── Button.ts
 │    └── Utils.ts
 └── Header.ts
```

Status:

```
v1 Complete
```

## 📅 Planned Packages

- compiler
- runtime
- cache
- workers
- ui

---

# Current Progress

| Package | Status |
|---------|--------|
| github-loader | ✅ Complete |
| virtual-fs | ✅ Complete |
| analyzer | ✅ Complete |
| resolver | ✅ Complete |
| dependency-graph | ✅ Complete |
| compiler | 📅 Planned |
| runtime | 📅 Planned |

---

# Design Principles

GitStream follows a modular architecture.

Every package:

- has one responsibility
- can be tested independently
- can be published independently
- can be used independently

Packages are intentionally kept loosely coupled.

For example, the Virtual File System has no knowledge of GitHub. Repository data is mounted through adapters instead of creating direct dependencies.

---

# Roadmap

### Phase 1 — Repository

- [x] github-loader
- [x] virtual-fs
- [x] analyzer

### Phase 2 — Understanding

- [ ] resolver
- [ ] dependency-graph

### Phase 3 — Execution

- [ ] compiler
- [ ] runtime

### Phase 4 — Ecosystem

- [ ] cache
- [ ] workers
- [ ] ui

---

# Long-Term Goal

Publish GitStream as a collection of npm packages so developers can build browser-native IDEs, documentation sites, code playgrounds, AI tools, and interactive portfolios without requiring local clones or backend infrastructure.

---

# License

MIT