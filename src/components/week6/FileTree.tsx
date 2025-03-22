import React, { useEffect, useState } from "react";
import { FcFile, FcFolder, FcOpenedFolder } from "react-icons/fc";

interface DirectoryTree {
  root: FileSystemEntry;
}

interface FileSystemEntry {
  path: string;
  name: string;
  isDirectory: boolean;
  parent: FileSystemEntry | null;
  children: FileSystemEntry[];
}

const mockFileSystem: Record<string, boolean> = {
  "/": true,
  "/Documents": true,
  "/Documents/work": true,
  "/Documents/work/project.txt": false,
  "/Documents/personal": true,
  "/Documents/personal/notes.txt": false,
  "/Games": true,
  "/Games/CSGO": true,
  "/Games/CSGO/csgo.exe": false,
};

function normalizePath(path: string): string {
  if (path === "/") return path;
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function buildFileSystemTree(rootPath: string): DirectoryTree {
  const normalizedRoot = normalizePath(rootPath);
  const rootName =
    normalizedRoot === "/"
      ? "root"
      : normalizedRoot.split("/").filter(Boolean).pop() || "";

  const rootEntry: FileSystemEntry = {
    path: normalizedRoot,
    name: rootName,
    isDirectory: true,
    parent: null,
    children: [],
  };

  const tree: DirectoryTree = { root: rootEntry };
  const paths = Object.keys(mockFileSystem)
    .filter((path) => {
      const normalizedPath = normalizePath(path);
      return (
        normalizedPath.startsWith(normalizedRoot) &&
        normalizedPath !== normalizedRoot
      );
    })
    .sort((a, b) => a.split("/").length - b.split("/").length);

  for (const path of paths) {
    insertPathIntoTree(
      tree,
      normalizePath(path),
      mockFileSystem[path],
      rootEntry,
      normalizedRoot
    );
  }

  return tree;
}

function insertPathIntoTree(
  tree: DirectoryTree,
  fullPath: string,
  isDirectory: boolean,
  rootEntry: FileSystemEntry,
  rootPath: string
): void {
  let relativePath = fullPath;
  if (fullPath.startsWith(rootPath)) {
    relativePath = fullPath.slice(rootPath.length);
  }
  if (relativePath.startsWith("/")) {
    relativePath = relativePath.slice(1);
  }

  const pathParts = relativePath.split("/").filter(Boolean);
  let currentPath = rootPath;
  let currentNode = rootEntry;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath = normalizePath(`${currentPath}/${part}`);

    if (i === pathParts.length - 1) {
      currentNode.children.push({
        path: fullPath,
        name: part,
        isDirectory,
        parent: currentNode,
        children: [],
      });
    } else {
      let childNode = currentNode.children.find((child) => child.name === part);

      if (!childNode) {
        childNode = {
          path: currentPath,
          name: part,
          isDirectory: true,
          parent: currentNode,
          children: [],
        };
        currentNode.children.push(childNode);
      }

      currentNode = childNode;
    }
  }
}

function findEntryByPath(
  tree: DirectoryTree,
  targetPath: string
): FileSystemEntry | null {
  const normalizedPath = normalizePath(targetPath);
  const queue = [tree.root];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (normalizePath(current.path) === normalizedPath) return current;
    if (current.isDirectory) queue.push(...current.children);
  }

  return null;
}

function insertEntry(
  tree: DirectoryTree,
  parentPath: string,
  entryName: string,
  isDirectory: boolean
): DirectoryTree {
  const parentEntry = findEntryByPath(tree, parentPath);

  if (!parentEntry || !parentEntry.isDirectory) {
    console.error(
      `Cannot insert into ${parentPath}: parent not found or not a directory`
    );
    return tree;
  }

  const newPath = normalizePath(`${parentPath}/${entryName}`);

  if (parentEntry.children.some((child) => child.name === entryName)) {
    console.error(`Entry ${entryName} already exists in ${parentPath}`);
    return tree;
  }

  try {
    mockFileSystem[newPath] = isDirectory;

    parentEntry.children.push({
      path: newPath,
      name: entryName,
      isDirectory,
      parent: parentEntry,
      children: [],
    });

    return { ...tree };
  } catch (error) {
    console.error(`Error inserting entry ${newPath}:`, error);
    return tree;
  }
}

function deleteEntryByPath(
  tree: DirectoryTree,
  entryPath: string
): DirectoryTree {
  const normalizedPath = normalizePath(entryPath);
  const entry = findEntryByPath(tree, normalizedPath);

  if (!entry || entry === tree.root || !entry.parent) {
    console.error(
      `Cannot delete ${normalizedPath}: entry not found, is root, or has no parent`
    );
    return tree;
  }

  try {
    if (entry.isDirectory) {
      Object.keys(mockFileSystem).forEach((path) => {
        const normalizedCurrentPath = normalizePath(path);
        if (
          normalizedCurrentPath === normalizedPath ||
          normalizedCurrentPath.startsWith(`${normalizedPath}/`)
        ) {
          delete mockFileSystem[path];
        }
      });
    } else {
      delete mockFileSystem[entryPath];
    }

    const parent = entry.parent;
    const index = parent.children.findIndex(
      (child) => normalizePath(child.path) === normalizedPath
    );
    if (index !== -1) parent.children.splice(index, 1);

    return { ...tree };
  } catch (error) {
    console.error(`Error deleting entry ${normalizedPath}:`, error);
    return tree;
  }
}

const FileTree: React.FC = () => {
  const [tree, setTree] = useState<DirectoryTree | null>(null);
  const [message, setMessage] = useState<string>("");
  const [rootPath, setRootPath] = useState<string>("/");
  const [newEntryName, setNewEntryName] = useState<string>("");
  const [isDirectory, setIsDirectory] = useState<boolean>(true);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["/"])
  );
  const [selectedIsDirectory, setSelectedIsDirectory] = useState<boolean>(true);

  useEffect(() => {
    try {
      setTree(buildFileSystemTree(rootPath));
      setMessage(`Tree built successfully for ${rootPath}`);
      setExpandedPaths(new Set(["/"]));
      setSelectedPath("/");
      setSelectedIsDirectory(true);
    } catch (error) {
      console.error("Error building tree:", error);
      setMessage(`Error building tree: ${error}`);
    }
  }, [rootPath]);

  const handleAddEntry = () => {
    if (!tree || !newEntryName) return;

    if (!selectedIsDirectory) {
      setMessage(`Cannot create inside a file. Please select a directory.`);
      return;
    }

    try {
      setTree(insertEntry(tree, selectedPath, newEntryName, isDirectory));
      setNewEntryName("");
      setMessage(
        `${
          isDirectory ? "Directory" : "File"
        } "${newEntryName}" created at ${selectedPath}`
      );

      setExpandedPaths((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedPath);
        return newSet;
      });
    } catch (error) {
      setMessage(`Error creating entry: ${error}`);
    }
  };

  const handleDeleteEntry = () => {
    if (!tree || selectedPath === "/") return;

    try {
      setTree(deleteEntryByPath(tree, selectedPath));
      setSelectedPath("/");
      setSelectedIsDirectory(true);
      setMessage(`Entry at ${selectedPath} deleted`);
    } catch (error) {
      setMessage(`Error deleting entry: ${error}`);
    }
  };

  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleSelectPath = (path: string, isDirectory: boolean) => {
    setSelectedPath(path);
    setSelectedIsDirectory(isDirectory);
  };

  const TreeNode: React.FC<{
    entry: FileSystemEntry;
    indent?: number;
    onSelect: (path: string, isDirectory: boolean) => void;
  }> = ({ entry, indent = 0, onSelect }) => {
    const isSelected = selectedPath === entry.path;
    const isExpanded = expandedPaths.has(entry.path);

    const handleFolderClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(entry.path, entry.isDirectory);
    };

    const handleFolderIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (entry.isDirectory) {
        toggleExpanded(entry.path);
      }
    };

    return (
      <div>
        <div
          className={`flex items-center cursor-pointer ${
            isSelected ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${indent * 20}px` }}
          onClick={handleFolderClick}
          onDoubleClick={() => entry.isDirectory && toggleExpanded(entry.path)}
        >
          <span className="mr-1" onClick={handleFolderIconClick}>
            {entry.isDirectory ? (
              isExpanded ? (
                <FcOpenedFolder />
              ) : (
                <FcFolder />
              )
            ) : (
              <FcFile />
            )}
          </span>
          <span>{entry.name}</span>
        </div>

        {isExpanded &&
          entry.isDirectory &&
          entry.children.map((child, index) => (
            <TreeNode
              key={index}
              entry={child}
              indent={indent + 1}
              onSelect={onSelect}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">File System Directory Tree</h2>

      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          value={rootPath}
          onChange={(e) => setRootPath(e.target.value)}
          placeholder="Enter root path"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            try {
              setTree(buildFileSystemTree(rootPath));
              setMessage(`Tree rebuilt successfully for ${rootPath}`);
              setExpandedPaths(new Set(["/"]));
              setSelectedPath("/");
              setSelectedIsDirectory(true);
            } catch (error) {
              setMessage(`Error building tree: ${error}`);
            }
          }}
        >
          Rebuild Tree
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 font-semibold">Directory Structure</div>
          <div className="bg-white p-4 border rounded h-96 overflow-auto">
            {tree ? (
              <TreeNode entry={tree.root} onSelect={handleSelectPath} />
            ) : (
              <div>Loading tree...</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">Add/Edit file</div>
          <div className="bg-white p-4 rounded">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">
                Selected path: {selectedPath}{" "}
                {!selectedIsDirectory && " (File)"}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="border p-2 mr-2 w-full mb-2"
                  value={newEntryName}
                  onChange={(e) => setNewEntryName(e.target.value)}
                  placeholder="New file/directory name"
                  disabled={!selectedIsDirectory}
                />

                <div className="flex items-center mb-2">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      checked={isDirectory}
                      onChange={() => setIsDirectory(true)}
                      className="mr-1"
                      disabled={!selectedIsDirectory}
                    />
                    Directory
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={!isDirectory}
                      onChange={() => setIsDirectory(false)}
                      className="mr-1"
                      disabled={!selectedIsDirectory}
                    />
                    File
                  </label>
                </div>

                <button
                  className={`${
                    selectedIsDirectory ? "bg-green-500" : "bg-gray-400"
                  } text-white px-4 py-2 rounded w-full`}
                  onClick={handleAddEntry}
                  disabled={!selectedIsDirectory || !newEntryName}
                >
                  Create in selected directory
                </button>
              </div>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded w-full"
                onClick={handleDeleteEntry}
                disabled={selectedPath === "/"}
              >
                Delete selected entry
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 p-2 border bg-gray-50">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTree;
