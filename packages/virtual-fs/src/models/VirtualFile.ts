export interface VirtualFile {
  type: "file";
  name: string;
  path: string;

  content: string;
}