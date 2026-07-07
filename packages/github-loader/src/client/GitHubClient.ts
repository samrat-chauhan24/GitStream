import axios, { AxiosInstance } from "axios";
import { GitHubRepository, GitHubTree } from "../models";

export class GitHubClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github+json"
      }
    });
  }

  async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
        const response = await this.client.get(
          `/repos/${owner}/${repo}`
        );
        // console.log(response.data);
        return {
          id: response.data.id,
          name: response.data.name,
          fullName: response.data.full_name,
          defaultBranch: response.data.default_branch,
          private: response.data.private,
          description: response.data.description
        };
      }
      
  async getRepositoryTree(
    owner: string,
    repo: string,
    branch: string
  ): Promise<GitHubTree> {

    const response = await this.client.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    return {
      truncated: response.data.truncated,
      nodes: response.data.tree.map((node: any) => ({
        path: node.path,
        sha: node.sha,
        type: node.type
      }))
    };
  }
}