export interface GitHubTreeNode {
  path: string;
  sha: string;
  type: "blob" | "tree";
}

export interface GitHubTree {
  truncated: boolean;
  nodes: GitHubTreeNode[];
}