# GitStream Software Requirements Specification (SRS)

**Version:** 1.0 (Draft)\
**Project Name:** GitStream\
**Document Type:** Software Requirements Specification (SRS)\
**Author:** Samrat Chauhan\
**Status:** Draft

------------------------------------------------------------------------

# Table of Contents

1.  Introduction
    -   Purpose
    -   Scope
    -   Definitions
    -   References
2.  Overall Description
3.  Functional Requirements
4.  Non-Functional Requirements
5.  System Architecture Overview
6.  Use Cases
7.  Out of Scope (V1)
8.  Future Scope
9.  Risks
10. Acceptance Criteria

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

GitStream is a browser-native GitHub project execution engine that
enables users to execute compatible public GitHub frontend repositories
directly inside a web browser without requiring local installation,
dependency management, or a traditional backend server.

The portfolio website is the **first application** built on top of
GitStream.

## 1.2 Scope

GitStream v1 supports compatible client-side React/Vite applications.

Supported capabilities:

-   Repository retrieval
-   Repository analysis
-   Virtual File System
-   Dependency resolution
-   Client-side compilation
-   Sandboxed execution

Excluded from v1:

-   Backend frameworks
-   Server-side rendering
-   Secret environment variables
-   Private repositories

## 1.3 Definitions

  Term                  Description
  --------------------- ----------------------------------------------
  Repository            Public GitHub source project
  Runtime               Pipeline that prepares and launches projects
  Sandbox               Isolated execution environment
  Virtual File System   Browser-resident filesystem abstraction
  Dependency Graph      Graph of module relationships
  Bundle                Final compiled JavaScript output
  Compatible Project    Repository supported by GitStream v1

## 1.4 References

-   GitHub REST API
-   ECMAScript Modules
-   WebAssembly
-   esbuild-wasm
-   React
-   Vite

------------------------------------------------------------------------

# 2. Overall Description

## Product Perspective

    Portfolio
        │
        ▼
    GitStream Engine
        │
        ▼
    GitHub Repository
        │
        ▼
    Browser Runtime

GitStream is designed as an independent execution engine that can later
power products beyond the portfolio.

## Product Vision

Enable users to execute compatible GitHub repositories directly inside
the browser while exposing the complete software execution pipeline.

## Users

-   Recruiters
-   Software Engineers
-   Students
-   Open Source Contributors

## Assumptions

-   Internet connectivity
-   Public GitHub repositories
-   Browser supports ES Modules
-   IndexedDB
-   Web Workers
-   WebAssembly

## Constraints

-   Browser-only
-   No backend
-   Public repositories only
-   React/Vite applications only
-   No secret environment variables

------------------------------------------------------------------------

# 3. Functional Requirements

## FR-1 Repository Loading

The system shall retrieve repository metadata and file structure from
GitHub.

## FR-2 Repository Analysis

The system shall analyze:

-   Framework
-   Build tool
-   Entry file
-   Environment variable requirements
-   Overall compatibility

## FR-3 Virtual File System

The system shall reconstruct downloaded files inside an in-memory
Virtual File System.

## FR-4 Dependency Resolution

The system shall resolve:

-   Local imports
-   npm packages
-   Aliases

## FR-5 Browser Compilation

The system shall compile:

-   JavaScript
-   TypeScript
-   JSX
-   TSX

## FR-6 Runtime Execution

The system shall execute bundled code inside a sandboxed runtime.

## FR-7 Runtime Diagnostics

The system shall display:

-   Compilation errors
-   Runtime errors
-   Compatibility warnings

## FR-8 Repository Cache

The system shall cache:

-   Repository tree
-   Source files
-   Metadata

using IndexedDB.

------------------------------------------------------------------------

# 4. Non-Functional Requirements

## Performance

-   Repository loading: \< 5 seconds
-   Compilation: \< 3 seconds
-   Cached startup: \< 1 second

## Security

-   Never expose API keys
-   Never expose secret environment variables
-   Execute applications inside an isolated sandbox

## Reliability

Runtime crashes must never crash the portfolio.

## Maintainability

Subsystems must remain independently replaceable.

## Scalability

Future support for additional frameworks.

## Usability

-   Single-click execution
-   Clear diagnostics
-   Minimal user interaction

------------------------------------------------------------------------

# 5. System Architecture Overview

    Portfolio UI
          │
          ▼
    GitHub Loader
          │
          ▼
    Virtual File System
          │
          ▼
    Dependency Analyzer
          │
          ▼
    Module Resolver
          │
          ▼
    Compiler
          │
          ▼
    Runtime
          │
          ▼
    Sandbox

------------------------------------------------------------------------

# 6. Use Cases

### UC-1 Run Compatible Project

User selects a project.

Repository downloads, compiles, and executes.

### UC-2 Unsupported Repository

System detects unsupported features and displays diagnostics.

### UC-3 Repository Requires Secrets

System blocks execution and explains why.

### UC-4 Cached Repository

Repository loads directly from IndexedDB cache.

------------------------------------------------------------------------

# 7. Out of Scope (Version 1)

-   Next.js
-   Angular
-   Vue
-   Express
-   Docker
-   Electron
-   Native Node.js APIs
-   Authentication
-   Private repositories
-   Secret API keys

------------------------------------------------------------------------

# 8. Future Scope

-   WebContainers
-   Plugin architecture
-   Additional frontend frameworks
-   AI-powered compatibility analysis
-   Shareable runtime sessions
-   Custom package registries

------------------------------------------------------------------------

# 9. Risks

  Risk                           Mitigation
  ------------------------------ ----------------------------
  GitHub API rate limits         IndexedDB cache and ETags
  Unsupported packages           Compatibility analyzer
  Browser incompatibility        Feature detection
  Large repositories             Lazy loading
  Runtime crashes                Sandboxed execution
  Secret environment variables   Detect and block execution

------------------------------------------------------------------------

# 10. Acceptance Criteria

GitStream v1 is complete when it can:

-   Fetch a compatible public GitHub repository
-   Reconstruct the repository in memory
-   Analyze compatibility
-   Resolve dependencies
-   Compile React/Vite applications in the browser
-   Execute inside a sandbox
-   Cache repositories
-   Display useful diagnostics
-   Keep the portfolio stable even if execution fails

------------------------------------------------------------------------

## Next Documents

After the SRS, the project will include:

-   High-Level Design (HLD)
-   Low-Level Design (LLD)
-   Architecture Decision Records (ADR)
-   Sequence Diagrams
-   State Machine
-   Component Diagrams
-   Requirements Traceability Matrix (RTM)
-   System Context Diagram
