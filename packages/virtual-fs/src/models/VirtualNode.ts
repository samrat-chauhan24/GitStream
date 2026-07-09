import { VirtualDirectory } from "./VirtualDirectory";
import { VirtualFile } from "./VirtualFile";

export type VirtualNode =
  | VirtualDirectory
  | VirtualFile;