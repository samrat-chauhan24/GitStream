export interface GitHubRepositoryReference {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
}