export interface PackageJson {
  name?: string;

  version?: string;

  private?: boolean;

  type?: "module" | "commonjs";

  scripts?: Record<string, string>;

  dependencies?: Record<string, string>;

  devDependencies?: Record<string, string>;

  peerDependencies?: Record<string, string>;

  optionalDependencies?: Record<string, string>;

  exports?: unknown;

  workspaces?: string[] | { packages: string[] };

  packageManager?: string;
}