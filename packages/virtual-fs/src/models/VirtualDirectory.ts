import { VirtualNode } from "./VirtualNode";

export interface VirtualDirectory {
  type: "directory";
  name: string;
  path: string;

  children: Map<string, VirtualNode>;
}