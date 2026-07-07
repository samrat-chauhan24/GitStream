import {
  GitHubRepository,
  GitHubTree,
  GitHubFile,
  Repository
} from "../models";

export class RepositoryBuilder {

  build(
    metadata: GitHubRepository,
    tree: GitHubTree,
    files: GitHubFile[]
  ): Repository {

    const map = new Map<string, GitHubFile>();

    for (const file of files) {
      map.set(file.path, file);
    }

    return {
      metadata,
      tree,
      files: map
    };

  }

}