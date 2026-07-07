import {
  GitHubRepository,
  GitHubTree,
  GitHubFile
} from "./";

export interface Repository {
  metadata: GitHubRepository;

  tree: GitHubTree;

  files: Map<string, GitHubFile>;
}