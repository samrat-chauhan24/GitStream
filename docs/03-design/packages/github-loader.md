# GitHub Loader Package

**Package:** github-loader

**Status:** Design Phase

**Version:** 1.0

---

# 1. Purpose

The GitHub Loader package is responsible for retrieving public GitHub repositories and converting them into an internal Repository object that can be consumed by the rest of GitStream.

This package abstracts all communication with the GitHub APIs.

No other package should communicate directly with GitHub.

---

# 2. Responsibilities

The GitHub Loader is responsible for:

- Parsing GitHub repository URLs
- Fetching repository metadata
- Fetching repository tree structure
- Downloading repository files
- Downloading package.json
- Determining the default branch
- Returning a complete Repository object
- Integrating with the Cache package
- Handling GitHub API failures

---

# 3. Non-Responsibilities

The GitHub Loader is NOT responsible for:

- Framework detection
- Dependency analysis
- Compilation
- Runtime execution
- Module resolution
- Compatibility analysis

Those responsibilities belong to other packages.

---

# 4. Inputs

The package accepts:

- GitHub Repository URL

Example:

https://github.com/facebook/react

or

https://github.com/user/project

---

# 5. Outputs

The package produces:

Repository

which contains:

- Metadata
- Repository Tree
- Files
- Branch
- package.json
- README (if available)

---

# 6. Public API

The package exposes the following public interface.

## parseRepository()

Purpose

Extract owner and repository name.

Input

Repository URL

Output

Repository Identifier

---

## fetchRepositoryMetadata()

Purpose

Retrieve repository metadata.

Uses

GitHub REST API

Returns

Repository Metadata

---

## fetchRepositoryTree()

Purpose

Retrieve repository tree.

Returns

Repository Tree

---

## downloadRepository()

Purpose

Download all supported source files.

Returns

Repository Files

---

## loadRepository()

Purpose

High-level orchestration function.

Flow

Parse URL

↓

Fetch Metadata

↓

Fetch Tree

↓

Download Files

↓

Create Repository Object

↓

Return Repository

---

# 7. Internal Components

The package consists of:

Repository URL Parser

↓

GitHub API Client

↓

Tree Downloader

↓

File Downloader

↓

Repository Builder

↓

Repository Validator

---

# 8. Data Models

Repository

RepositoryFile

RepositoryMetadata

RepositoryTree

RepositoryIdentifier

---

# 9. Repository Object

The final Repository object contains:

Repository Information

↓

Metadata

↓

Files

↓

Directory Tree

↓

Branch

↓

package.json

↓

README

↓

Download Timestamp

---

# 10. Dependencies

Depends On

shared

cache

Uses

GitHub REST API

Browser Fetch API

---

# 11. Error Types

RepositoryNotFoundError

InvalidRepositoryError

GitHubRateLimitError

NetworkError

BranchNotFoundError

DownloadError

RepositoryValidationError

---

# 12. Cache Strategy

Before requesting GitHub:

Check Cache

↓

Repository Exists?

↓

Yes

↓

Return Cached Repository

↓

No

↓

Download Repository

↓

Store Cache

↓

Return Repository

---

# 13. Retry Strategy

Network failures:

Retry

Maximum Attempts

3

Backoff

Exponential

---

# 14. Sequence Flow

User

↓

Portfolio

↓

GitHub Loader

↓

Cache Check

↓

GitHub API

↓

Repository Builder

↓

Repository

---

# 15. Security

Only public repositories are supported.

Authentication tokens are optional.

Private repositories are rejected.

No credentials are stored.

---

# 16. Performance Goals

Repository Metadata

< 500ms

Repository Tree

< 2 seconds

Repository Download

< 5 seconds

Cache Retrieval

< 100ms

---

# 17. Future Improvements

Support GitHub GraphQL API

Incremental Downloads

Partial Repository Loading

Streaming Downloads

Git LFS Support

Private Repository Authentication

Repository Diff Downloads

---

# 18. Testing Strategy

Unit Tests

Repository URL parsing

Repository Builder

Repository Validation

Integration Tests

GitHub API

Cache

Download Flow

Error Handling

---

# 19. Open Questions

Should large repositories be downloaded lazily?

Should binary files be ignored?

Should assets be downloaded immediately?

Should hidden files be downloaded?
