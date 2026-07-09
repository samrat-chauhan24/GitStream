import {
  VirtualDirectory,
  VirtualStat,
  VirtualNode,
  DirectoryEntry,
} from "./models";

/**
 * An in-memory virtual file system used by GitStream.
 *
 * It provides a lightweight filesystem abstraction for
 * storing, reading, and manipulating files and directories
 * without touching the host machine's filesystem.
 */
export class VirtualFileSystem {
  readonly root: VirtualDirectory;

  constructor() {
    this.root = {
      type: "directory",
      name: "",
      path: "/",
      children: new Map(),
    };
  }

  // Splits a filesystem path into individual segments.
  private splitPath(path: string): string[] {
    return path.split("/").filter(Boolean);
  }

  // Resolves any node (file or directory) from its absolute path.
  private getNode(path: string): VirtualNode | undefined {
    if (path === "/" || path === "") {
      return this.root;
    }

    const parts = this.splitPath(path);

    let current = this.root;

    for (let i = 0; i < parts.length; i++) {
      const node = current.children.get(parts[i]);

      if (!node) {
        return undefined;
      }

      if (i === parts.length - 1) {
        return node;
      }

      if (node.type !== "directory") {
        return undefined;
      }

      current = node;
    }

    return undefined;
  }

  // Resolves a directory from its path.
  private getDirectory(path: string): VirtualDirectory | undefined {
    const node = this.getNode(path);

    return node?.type === "directory"
      ? node
      : undefined;
  }

  // Returns the parent directory and target name for a given path.
  private getParentDirectory(path: string): {
    directory: VirtualDirectory;
    name: string;
  } {
    const parts = this.splitPath(path);

    const name = parts.pop();

    if (!name) {
      throw new Error("Invalid path.");
    }

    const directory = this.getDirectory(
      "/" + parts.join("/")
    );

    if (!directory) {
      throw new Error("Parent directory not found.");
    }

    return {
      directory,
      name,
    };
  }
  // Recursively updates the path of a node and all its descendants.
  private updatePaths(node: VirtualNode): void {
    if (node.type === "file") {
      return;
    }

    for (const child of node.children.values()) {
      child.path =
        node.path === "/"
          ? `/${child.name}`
          : `${node.path}/${child.name}`;

      this.updatePaths(child);
    }
  }
  /**
   * Creates a directory and any missing parent directories.
   *
   * @param path Directory path.
   */
  mkdir(path: string): void {
    const parts = this.splitPath(path);

    let current = this.root;

    for (const part of parts) {
      let child = current.children.get(part);

      if (!child) {
        child = {
          type: "directory",
          name: part,
          path:
            current.path === "/"
              ? `/${part}`
              : `${current.path}/${part}`,
          children: new Map(),
        };

        current.children.set(part, child);
      }

      if (child.type !== "directory") {
        throw new Error(`${part} is not a directory.`);
      }

      current = child;
    }
  }

  /**
   * Creates a new file or overwrites an existing one.
   * Missing parent directories are created automatically.
   *
   * @param path File path.
   * @param content File contents.
   */
  writeFile(path: string, content: string): void {
    const parts = this.splitPath(path);

    const fileName = parts.pop();

    if (!fileName) {
      throw new Error("Invalid file path.");
    }

    const directoryPath = "/" + parts.join("/");

    this.mkdir(directoryPath);

    const directory = this.getDirectory(directoryPath);

    if (!directory) {
      throw new Error("Parent directory not found.");
    }

    directory.children.set(fileName, {
      type: "file",
      name: fileName,
      path,
      content,
    });
  }

  /**
   * Reads the contents of a file.
   *
   * @param path File path.
   * @returns File contents.
   * @throws Error if the file does not exist.
   */
  readFile(path: string): string {
    const node = this.getNode(path);

    if (!node || node.type !== "file") {
      throw new Error(`File not found: ${path}`);
    }

    return node.content;
  }

  /**
   * Checks whether a file or directory exists.
   *
   * @param path File or directory path.
   * @returns True if the path exists; otherwise false.
   */
  exists(path: string): boolean {
    return this.getNode(path) !== undefined;
  }

  /**
   * Lists the names of all files and directories
   * contained in a directory.
   *
   * @param path Directory path.
   * @returns Names of all child nodes.
   * @throws Error if the directory does not exist.
   */
  list(path: string): string[] {
    const directory = this.getDirectory(path);

    if (!directory) {
      throw new Error(`Directory not found: ${path}`);
    }

    return [...directory.children.keys()];
  }

  /**
   * Deletes a file or an empty directory.
   *
   * @param path File or directory path.
   * @throws Error if the path does not exist.
   * @throws Error if the directory is not empty.
   */
  delete(path: string): void {
    if (path === "/" || path === "") {
      throw new Error("Cannot delete root directory.");
    }

    const { directory, name } =
      this.getParentDirectory(path);

    const node = directory.children.get(name);

    if (!node) {
      throw new Error(`Path not found: ${path}`);
    }

    if (
      node.type === "directory" &&
      node.children.size > 0
    ) {
      throw new Error("Directory is not empty.");
    }

    directory.children.delete(name);
  }

  /**
   * Moves a file to a new location.
   * Parent directories of the destination
   * are created automatically.
   *
   * @param from Source file path.
   * @param to Destination file path.
   */
  move(from: string, to: string): void {
    const content = this.readFile(from);

    this.writeFile(to, content);

    this.delete(from);
  }

  /**
   * Copies a file to a new location.
   * Parent directories of the destination
   * are created automatically.
   *
   * @param from Source file path.
   * @param to Destination file path.
   */
  copy(from: string, to: string): void {
    const content = this.readFile(from);

    this.writeFile(to, content);
  }

  /**
   * Returns metadata about a file or directory.
   *
   * @param path File or directory path.
   * @returns Metadata describing the node.
   * @throws Error if the path does not exist.
   */
  stat(path: string): VirtualStat {

      const node = this.getNode(path);

      if (!node) {
          throw new Error(`Path not found: ${path}`);
      }

      return {
          type: node.type,
          name: node.name,
          path: node.path,
          size:
              node.type === "file"
                  ? node.content.length
                  : node.children.size
      };

  }
  
  /**
   * Renames a file or directory.
   *
   * @param path Existing file or directory path.
   * @param newName New name.
   * @throws Error if the path does not exist.
   */
  rename(
    path: string,
    newName: string
  ): void {

    const { directory, name } =
      this.getParentDirectory(path);

    const node = directory.children.get(name);

    if (!node) {
      throw new Error(`Path not found: ${path}`);
    }

    directory.children.delete(name);

    node.name = newName;

    node.path =
      directory.path === "/"
        ? `/${newName}`
        : `${directory.path}/${newName}`;

    this.updatePaths(node);

    directory.children.set(newName, node);
  }

  /**
   * Removes all files and directories
   * from the virtual file system.
   */
  clear(): void {
    this.root.children.clear();
  }
  
  /**
   * Recursively walks a directory and returns
   * the paths of all files it contains.
   *
   * @param path Directory path.
   * @returns Absolute paths of every file.
   * @throws Error if the directory does not exist.
   */
  walk(path: string): string[] {

    const directory = this.getDirectory(path);

    if (!directory) {
      throw new Error(`Directory not found: ${path}`);
    }

    const files: string[] = [];

    const traverse = (directory: VirtualDirectory): void => {

      for (const node of directory.children.values()) {

        if (node.type === "file") {
          files.push(node.path);
        } else {
          traverse(node);
        }

      }

    };

    traverse(directory);

    return files;

  }  
  /**
   * Finds the first file with the given name.
   *
   * @param name File name.
   * @returns Absolute file path, or undefined if not found.
   */
  find(
    name: string
  ): string | undefined {

    return this
      .walk("/")
      .find(path => path.endsWith(`/${name}`));

  }

  /**
   * Reads the contents of a directory.
   *
   * @param path Directory path.
   * @returns Metadata for every child node.
   * @throws Error if the directory does not exist.
   */
  readDirectory(
    path: string
  ): DirectoryEntry[] {

    const directory = this.getDirectory(path);

    if (!directory) {
      throw new Error(`Directory not found: ${path}`);
    }

    return [...directory.children.values()].map(node => ({
      name: node.name,
      path: node.path,
      type: node.type,
    }));

  }
}