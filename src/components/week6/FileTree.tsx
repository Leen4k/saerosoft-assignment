import React, { useEffect, useState } from "react";
import { FcFile, FcFolder, FcOpenedFolder } from "react-icons/fc";
import {
  Tree,
  TreeNode,
  createTreeNode,
  deleteNodeById,
  findNodeById,
  insertNode,
} from "../../utils/collections/tree";
import { TreeView } from "../common/TreeView";
import { TreeEditor } from "../common/TreeEditor";

interface FileData {
  name: string;
  isDirectory: boolean;
  path: string;
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

function buildFileSystemTree(rootPath: string): Tree<FileData> {
  const normalizedRoot = normalizePath(rootPath);
  const rootName =
    normalizedRoot === "/"
      ? "root"
      : normalizedRoot.split("/").filter(Boolean).pop() || "";

  const rootNode = createTreeNode<FileData>(
    normalizedRoot,
    {
      path: normalizedRoot,
      name: rootName,
      isDirectory: true,
    },
    null,
    []
  );

  const tree = new Tree<FileData>(rootNode);

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
      rootNode,
      normalizedRoot
    );
  }

  return tree;
}

function insertPathIntoTree(
  tree: Tree<FileData>,
  fullPath: string,
  isDirectory: boolean,
  rootNode: TreeNode<FileData>,
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
  let currentNode = rootNode;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath = normalizePath(`${currentPath}/${part}`);

    if (i === pathParts.length - 1) {
      const newNode = createTreeNode<FileData>(
        fullPath,
        {
          path: fullPath,
          name: part,
          isDirectory,
        },
        currentNode,
        []
      );
      currentNode.children.push(newNode);
    } else {
      let childNode = currentNode.children.find(
        (child) => child.data.name === part
      );

      if (!childNode) {
        childNode = createTreeNode<FileData>(
          currentPath,
          {
            path: currentPath,
            name: part,
            isDirectory: true,
          },
          currentNode,
          []
        );
        currentNode.children.push(childNode);
      }

      currentNode = childNode;
    }
  }
}

const FileTree: React.FC = () => {
  const [tree, setTree] = useState<Tree<FileData> | null>(null);
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
      const newPath = normalizePath(`${selectedPath}/${newEntryName}`);

      if (findNodeById(tree, newPath)) {
        setMessage(`Entry ${newEntryName} already exists in ${selectedPath}`);
        return;
      }

      const selectedNode = findNodeById(tree, selectedPath);
      if (!selectedNode) return;

      mockFileSystem[newPath] = isDirectory;

      const newNode = createTreeNode<FileData>(
        newPath,
        {
          path: newPath,
          name: newEntryName,
          isDirectory,
        },
        selectedNode,
        []
      );

      insertNode(tree, selectedPath, newNode);
      setTree(new Tree<FileData>(tree.root));
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
      const entry = findNodeById(tree, selectedPath);
      if (!entry) return;

      if (entry.data.isDirectory) {
        Object.keys(mockFileSystem).forEach((path) => {
          const normalizedCurrentPath = normalizePath(path);
          if (
            normalizedCurrentPath === selectedPath ||
            normalizedCurrentPath.startsWith(`${selectedPath}/`)
          ) {
            delete mockFileSystem[path];
          }
        });
      } else {
        delete mockFileSystem[selectedPath];
      }

      deleteNodeById(tree, selectedPath);
      setTree(new Tree<FileData>(tree.root));
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

  const handleSelectPath = (path: string) => {
    if (!tree) return;
    const node = findNodeById(tree, path);
    if (!node) return;

    setSelectedPath(path);
    setSelectedIsDirectory(node.data.isDirectory);
  };

  const renderFileNode = (node: TreeNode<FileData>, isSelected: boolean) => {
    const isExpanded = expandedPaths.has(node.id);

    return (
      <>
        <span
          className="mr-1"
          onClick={(e) => {
            e.stopPropagation();
            if (node.data.isDirectory) toggleExpanded(node.id);
          }}
        >
          {node.data.isDirectory ? (
            isExpanded ? (
              <FcOpenedFolder />
            ) : (
              <FcFolder />
            )
          ) : (
            <FcFile />
          )}
        </span>
        <span>{node.data.name}</span>
      </>
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
          {tree && (
            <TreeView
              tree={tree}
              selectedId={selectedPath}
              onSelect={handleSelectPath}
              renderNode={renderFileNode}
              expandedIds={expandedPaths}
              onToggleExpand={(id) => {
                const node = findNodeById(tree, id);
                if (node && node.data.isDirectory) toggleExpanded(id);
              }}
            />
          )}
        </div>

        <div>
          <TreeEditor
            selectedId={selectedPath}
            selectedLabel={`${selectedPath}${
              !selectedIsDirectory ? " (File)" : ""
            }`}
            canDelete={selectedPath !== "/"}
            canAdd={selectedIsDirectory}
            onAdd={handleAddEntry}
            onDelete={handleDeleteEntry}
            message={message}
          >
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
          </TreeEditor>
        </div>
      </div>
    </div>
  );
};

export default FileTree;
