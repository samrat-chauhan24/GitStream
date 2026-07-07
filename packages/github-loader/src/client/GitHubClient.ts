import axios, { AxiosInstance } from "axios";
import { GitHubRepository, GitHubTree, GitHubFile } from "../models";
import { decodeBase64 } from "../utils";
import "dotenv/config";

export class GitHubClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.github.com",
      timeout: 15000,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "GitStream",

        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });
  }

  async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    try {
      const response = await this.client.get(
        `/repos/${owner}/${repo}`
      );

      return {
        id: response.data.id,
        name: response.data.name,
        fullName: response.data.full_name,
        defaultBranch: response.data.default_branch,
        private: response.data.private,
        description: response.data.description,
      };
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getRepositoryTree(
    owner: string,
    repo: string,
    branch: string
  ): Promise<GitHubTree> {
    try {
      const response = await this.client.get(
        `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      );

      return {
        truncated: response.data.truncated,
        nodes: response.data.tree.map((node: any) => ({
          path: node.path,
          sha: node.sha,
          type: node.type,
        })),
      };
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getFile(
    owner: string,
    repo: string,
    path: string
  ): Promise<GitHubFile> {
    try {
      const response = await this.client.get(
        `/repos/${owner}/${repo}/contents/${path}`
      );

      return {
        path,
        sha: response.data.sha,
        content: decodeBase64(response.data.content),
      };
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 403) {
        throw new Error(
          `GitHub API rate limit exceeded.\n${data?.message ?? ""}\n\nTip: Set a GITHUB_TOKEN environment variable.`
        );
      }

      if (status === 404) {
        throw new Error("GitHub repository or file not found.");
      }

      throw new Error(
        `GitHub API Error (${status}): ${data?.message ?? "Unknown error"}`
      );
    }

    throw error;
  }
}