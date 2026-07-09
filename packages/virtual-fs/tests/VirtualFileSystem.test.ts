import { describe, expect, it } from "vitest";
import {
  VirtualFileSystem,
  VirtualDirectory,
  VirtualFile,
} from "../src";

describe("VirtualFileSystem", () => {

  it("creates a root directory", () => {

    const fs = new VirtualFileSystem();

    expect(fs.root.path).toBe("/");
    expect(fs.root.type).toBe("directory");
    expect(fs.root.children.size).toBe(0);

  });

  it("creates nested directories", () => {

    const fs = new VirtualFileSystem();

    fs.mkdir("src/components");

    expect(fs.root.children.has("src")).toBe(true);

  });

  it("writes a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/index.ts",
      "console.log('Hello');"
    );

    const src = vfs.root.children.get("src") as VirtualDirectory;

    const file = src.children.get("index.ts") as VirtualFile;

    expect(file.content).toBe("console.log('Hello');");
  });

  it("reads a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/index.ts",
      "console.log('Hello');"
    );

    const content = vfs.readFile("/src/index.ts");

    expect(content).toBe("console.log('Hello');");
  });

  it("returns true if a directory exists", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src/components");

  expect(vfs.exists("/src")).toBe(true);
  expect(vfs.exists("/src/components")).toBe(true);
});

  it("returns true if a file exists", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile(
      "/src/index.ts",
      "console.log('Hello');"
    );

    expect(vfs.exists("/src/index.ts")).toBe(true);
  });

  it("returns false for missing paths", () => {
    const vfs = new VirtualFileSystem();

    expect(vfs.exists("/src")).toBe(false);

    vfs.mkdir("/src");

    expect(vfs.exists("/src/App.tsx")).toBe(false);
  });

  it("lists files in a directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "");
    vfs.writeFile("/src/App.tsx", "");

    expect(vfs.list("/src")).toEqual([
      "index.ts",
      "App.tsx",
    ]);
  });

  it("lists directories and files", () => {
    const vfs = new VirtualFileSystem();

    vfs.mkdir("/src/components");
    vfs.writeFile("/src/index.ts", "");

    expect(vfs.list("/src")).toEqual([
      "components",
      "index.ts",
    ]);
  });

  it("lists an empty directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.mkdir("/src");

    expect(vfs.list("/src")).toEqual([]);
  });

  it("throws when directory does not exist", () => {
    const vfs = new VirtualFileSystem();

    expect(() => {
      vfs.list("/src");
    }).toThrow();
  });

  it("throws when path is a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/index.ts", "");

    expect(() => {
      vfs.list("/index.ts");
    }).toThrow();
  });

  it("deletes a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "");

    vfs.delete("/src/index.ts");

    expect(vfs.exists("/src/index.ts")).toBe(false);
  });

  it("deletes an empty directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.mkdir("/src/components");

    vfs.delete("/src/components");

    expect(vfs.exists("/src/components")).toBe(false);
  });

  it("throws when deleting a non-empty directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "");

    expect(() => {
      vfs.delete("/src");
    }).toThrow();
  });

  it("throws when path does not exist", () => {
    const vfs = new VirtualFileSystem();

    expect(() => {
      vfs.delete("/abc");
    }).toThrow();
  });

  it("cannot delete root", () => {
    const vfs = new VirtualFileSystem();

    expect(() => {
      vfs.delete("/");
    }).toThrow();
  });

  it("moves a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "hello");

    vfs.move("/src/index.ts", "/src/main.ts");

    expect(vfs.exists("/src/index.ts")).toBe(false);
    expect(vfs.exists("/src/main.ts")).toBe(true);
    expect(vfs.readFile("/src/main.ts")).toBe("hello");
  });

  it("moves a file to another directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "hello");

    vfs.move("/src/index.ts", "/dist/index.ts");

    expect(vfs.exists("/src/index.ts")).toBe(false);
    expect(vfs.exists("/dist/index.ts")).toBe(true);
  });

  it("throws when source file does not exist", () => {
    const vfs = new VirtualFileSystem();

    expect(() => {
      vfs.move("/a.ts", "/b.ts");
    }).toThrow();
  });

  it("overwrites destination file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/a.ts", "hello");
    vfs.writeFile("/b.ts", "world");

    vfs.move("/a.ts", "/b.ts");

    expect(vfs.readFile("/b.ts")).toBe("hello");
  });

  it("copies a file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "hello");

    vfs.copy("/src/index.ts", "/src/main.ts");

    expect(vfs.exists("/src/index.ts")).toBe(true);
    expect(vfs.exists("/src/main.ts")).toBe(true);

    expect(
      vfs.readFile("/src/main.ts")
    ).toBe("hello");
  });

  it("copies a file to another directory", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/src/index.ts", "hello");

    vfs.copy("/src/index.ts", "/dist/index.ts");

    expect(vfs.exists("/src/index.ts")).toBe(true);
    expect(vfs.exists("/dist/index.ts")).toBe(true);
  });

  it("throws when source file does not exist", () => {
    const vfs = new VirtualFileSystem();

    expect(() => {
      vfs.copy("/a.ts", "/b.ts");
    }).toThrow();
  });

  it("overwrites destination file", () => {
    const vfs = new VirtualFileSystem();

    vfs.writeFile("/a.ts", "hello");
    vfs.writeFile("/b.ts", "world");

    vfs.copy("/a.ts", "/b.ts");

    expect(
      vfs.readFile("/b.ts")
    ).toBe("hello");

    expect(
      vfs.readFile("/a.ts")
    ).toBe("hello");
  });

  it("returns file metadata", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile(
    "/src/index.ts",
    "hello"
  );

  expect(
    vfs.stat("/src/index.ts")
  ).toEqual({
    type: "file",
    name: "index.ts",
    path: "/src/index.ts",
    size: 5,
  });
});

it("returns directory metadata", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src");

  expect(
    vfs.stat("/src")
  ).toEqual({
    type: "directory",
    name: "src",
    path: "/src",
    size: 0,
  });
});

it("returns directory size", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/src/a.ts", "");
  vfs.writeFile("/src/b.ts", "");

  expect(
    vfs.stat("/src").size
  ).toBe(2);
});

it("throws for missing path", () => {
  const vfs = new VirtualFileSystem();

  expect(() => {
    vfs.stat("/abc");
  }).toThrow();
});

it("renames a file", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/src/index.ts", "hello");

  vfs.rename("/src/index.ts", "main.ts");

  expect(vfs.exists("/src/index.ts")).toBe(false);
  expect(vfs.exists("/src/main.ts")).toBe(true);
  expect(vfs.readFile("/src/main.ts")).toBe("hello");
});

it("renames a directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src/components");

  vfs.rename("/src/components", "ui");

  expect(vfs.exists("/src/components")).toBe(false);
  expect(vfs.exists("/src/ui")).toBe(true);
});

it("throws if path does not exist", () => {
  const vfs = new VirtualFileSystem();

  expect(() => {
    vfs.rename("/abc", "xyz");
  }).toThrow();
});

it("clears the filesystem", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/src/index.ts", "hello");
  vfs.mkdir("/dist");

  vfs.clear();

  expect(vfs.root.children.size).toBe(0);
});

it("keeps the root directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.clear();

  expect(vfs.root.path).toBe("/");
  expect(vfs.root.type).toBe("directory");
});


it("updates descendant paths when renaming a directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile(
    "/src/components/Button.tsx",
    "button"
  );

  vfs.rename(
    "/src/components",
    "ui"
  );

  expect(
    vfs.exists("/src/ui/Button.tsx")
  ).toBe(true);

  expect(
    vfs.exists("/src/components/Button.tsx")
  ).toBe(false);

  expect(
    vfs.readFile("/src/ui/Button.tsx")
  ).toBe("button");
});

it("walks all files from root", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/package.json", "");
  vfs.writeFile("/src/index.ts", "");
  vfs.writeFile("/src/App.tsx", "");

  expect(vfs.walk("/")).toEqual([
    "/package.json",
    "/src/index.ts",
    "/src/App.tsx",
  ]);
});

it("walks a subdirectory", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/src/index.ts", "");
  vfs.writeFile("/src/App.tsx", "");
  vfs.writeFile("/test/test.ts", "");

  expect(vfs.walk("/src")).toEqual([
    "/src/index.ts",
    "/src/App.tsx",
  ]);
});

it("returns an empty array for an empty directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src");

  expect(vfs.walk("/src")).toEqual([]);
});

it("throws when directory does not exist", () => {
  const vfs = new VirtualFileSystem();

  expect(() => {
    vfs.walk("/abc");
  }).toThrow();
});

it("throws when path is a file", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/index.ts", "");

  expect(() => {
    vfs.walk("/index.ts");
  }).toThrow();
});

it("finds a file by name", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/src/components/Button.tsx", "");

  expect(
    vfs.find("Button.tsx")
  ).toBe("/src/components/Button.tsx");
});

it("finds a root file", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/package.json", "");

  expect(
    vfs.find("package.json")
  ).toBe("/package.json");
});

it("returns undefined when file does not exist", () => {
  const vfs = new VirtualFileSystem();

  expect(
    vfs.find("abc.ts")
  ).toBeUndefined();
});

it("reads a directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src/components");
  vfs.writeFile("/src/index.ts", "");

  expect(vfs.readDirectory("/src")).toEqual([
    {
      name: "components",
      path: "/src/components",
      type: "directory",
    },
    {
      name: "index.ts",
      path: "/src/index.ts",
      type: "file",
    },
  ]);
});

it("reads an empty directory", () => {
  const vfs = new VirtualFileSystem();

  vfs.mkdir("/src");

  expect(vfs.readDirectory("/src")).toEqual([]);
});

it("throws when directory does not exist", () => {
  const vfs = new VirtualFileSystem();

  expect(() => {
    vfs.readDirectory("/abc");
  }).toThrow();
});

it("throws when path is a file", () => {
  const vfs = new VirtualFileSystem();

  vfs.writeFile("/index.ts", "");

  expect(() => {
    vfs.readDirectory("/index.ts");
  }).toThrow();
});
});