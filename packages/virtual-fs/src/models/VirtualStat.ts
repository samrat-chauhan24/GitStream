export interface VirtualStat {
  type: "file" | "directory";
  name: string;
  path: string;

  size: number;
}