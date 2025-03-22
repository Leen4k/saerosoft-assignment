import React, { useEffect, useRef, useState } from "react";
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

interface DomData {
  tagName: string;
}

function buildDomTree(
  rootDivRef: React.RefObject<HTMLDivElement>
): Tree<DomData> {
  if (!rootDivRef.current) {
    throw new Error("There is no Root div reference");
  }

  const buildElement = (
    node: HTMLElement,
    parent: TreeNode<DomData> | null
  ): TreeNode<DomData> => {
    const id = node.id || `id-${Math.random().toString(36).substring(2, 9)}`;

    const element = createTreeNode<DomData>(
      id,
      { tagName: node.tagName.toLowerCase() },
      parent,
      []
    );

    Array.from(node.children).forEach((childNode) => {
      if (childNode instanceof HTMLElement) {
        const childElement = buildElement(childNode, element);
        element.children.push(childElement);
      }
    });

    return element;
  };

  const rootElement = buildElement(rootDivRef.current, null);
  return new Tree<DomData>(rootElement);
}

const DomTreeRenderer: React.FC<{ tree: Tree<DomData> }> = ({ tree }) => {
  const renderElement = (element: TreeNode<DomData>, depth: number = 0) => {
    const indent = depth * 20;

    return (
      <div key={element.id}>
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100"
          style={{ paddingLeft: `${indent}px` }}
        >
          <span className="px-2 py-1 text-blue-600">
            &lt;{element.data.tagName}&gt;
          </span>
          <span className="text-gray-500 text-sm ml-2">id: {element.id}</span>
        </div>
        {element.children.map((child) => renderElement(child, depth + 1))}
        <div
          className="flex items-center hover:bg-gray-100"
          style={{ paddingLeft: `${indent}px` }}
        >
          <span className="px-2 py-1 text-blue-600">
            &lt;/{element.data.tagName}&gt;
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="font-mono text-sm bg-white p-4 border rounded overflow-auto">
      {renderElement(tree.root)}
    </div>
  );
};

const ReactDomTree: React.FC = () => {
  const [tree, setTree] = useState<Tree<DomData> | null>(null);
  const [message, setMessage] = useState<string>("");
  const [newTagName, setNewTagName] = useState<string>("div");
  const [newId, setNewId] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const domContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (domContainerRef.current) {
      try {
        const initialTree = buildDomTree({ current: domContainerRef.current });
        setTree(initialTree);
        setSelectedId(initialTree.root.id);
        setMessage("DOM tree built successfully");
      } catch (error) {
        console.error("Error building DOM tree:", error);
        setMessage(`Error building DOM tree: ${error}`);
      }
    }
  }, []);

  const handleAddElement = () => {
    if (!tree || !newTagName) return;

    try {
      const parentNode = findNodeById(tree, selectedId);
      if (!parentNode) {
        setMessage(`Parent element with ID ${selectedId} not found`);
        return;
      }

      const id =
        newId || `random-id-${Math.random().toString(36).substring(2, 9)}`;

      const newElement = createTreeNode<DomData>(
        id,
        { tagName: newTagName },
        parentNode,
        []
      );

      insertNode(tree, selectedId, newElement);

      const parentDomNode = document.getElementById(parentNode.id);
      if (parentDomNode) {
        const newDomNode = document.createElement(newTagName);
        newDomNode.id = id;
        parentDomNode.appendChild(newDomNode);
      }

      setTree(new Tree<DomData>(tree.root));
      setNewId("");
      setMessage(
        `Element <${newTagName}> created under ${parentNode.data.tagName}#${parentNode.id}`
      );
    } catch (error) {
      setMessage(`Error creating element: ${error}`);
    }
  };

  const handleDeleteElement = () => {
    if (!tree || !selectedId || selectedId === tree.root.id) return;

    try {
      const nodeToDelete = document.getElementById(selectedId);
      if (nodeToDelete && nodeToDelete.parentNode) {
        nodeToDelete.parentNode.removeChild(nodeToDelete);
      }

      deleteNodeById(tree, selectedId);

      setTree(new Tree<DomData>(tree.root));
      setSelectedId(tree.root.id);
      setMessage(`Element with ID ${selectedId} deleted`);
    } catch (error) {
      setMessage(`Error deleting element: ${error}`);
    }
  };

  const renderDomNode = (node: TreeNode<DomData>) => {
    return (
      <>
        <span className="text-blue-600">&lt;{node.data.tagName}&gt;</span>
        <span className="text-gray-500 text-sm ml-2">id: {node.id}</span>
      </>
    );
  };

  const getSelectedLabel = () => {
    if (!tree || !selectedId) return "None";

    const node = findNodeById(tree, selectedId);
    if (!node) return "None";

    return `${node.data.tagName}#${node.id}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">React DOM structure</h2>
      <div ref={domContainerRef} className="hidden" id="dom-container">
        <div id="header">
          <h1 id="title">DOM Tree Demo</h1>
          <nav id="navigation">
            <ul id="nav-list">
              <li id="nav-item-1">Home</li>
              <li id="nav-item-2">About</li>
            </ul>
          </nav>
        </div>
        <div id="main-content">
          <article id="article-1">
            <h2 id="article-title">Article Title</h2>
            <p id="paragraph-1">This is a paragraph.</p>
            <p id="paragraph-2">This is another paragraph.</p>
          </article>
          <aside id="sidebar">
            <h3 id="sidebar-title">Related Links</h3>
            <ul id="sidebar-list">
              <li id="sidebar-item-1">Link 1</li>
              <li id="sidebar-item-2">Link 2</li>
            </ul>
          </aside>
        </div>
        <div id="footer">
          <p id="copyright">Copyright 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 font-semibold">DOM Structure</div>
          {tree && (
            <TreeView
              tree={tree}
              selectedId={selectedId}
              onSelect={setSelectedId}
              renderNode={renderDomNode}
            />
          )}
        </div>

        <div>
          <TreeEditor
            selectedId={selectedId}
            selectedLabel={getSelectedLabel()}
            canDelete={selectedId !== "" && selectedId !== tree?.root.id}
            canAdd={selectedId !== ""}
            onAdd={handleAddElement}
            onDelete={handleDeleteElement}
            message={message}
          >
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                className="border p-2"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag (div, span, etc.)"
              />
              <input
                type="text"
                className="border p-2"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="Element ID (optional)"
              />
            </div>
          </TreeEditor>

          <div className="mt-4">
            <div className="mb-2 font-semibold">Rendered DOM Tree</div>
            {tree && <DomTreeRenderer tree={tree} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactDomTree;
