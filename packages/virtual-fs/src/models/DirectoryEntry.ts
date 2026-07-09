export interface DirectoryEntry {
  name: string;
  path: string;
  type: "file" | "directory";
}