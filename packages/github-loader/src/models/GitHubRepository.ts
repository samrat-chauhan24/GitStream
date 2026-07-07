export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  description: string | null;
}