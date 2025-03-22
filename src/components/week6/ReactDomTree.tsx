import React, { useEffect, useRef, useState } from "react";
import { Tree, findNode } from "../../utils/collections/tree";

interface DomData {
  id: string;
  tagName: string;
}

interface DomTree {
  root: DomElement;
}

interface DomElement {
  id: string;
  tagName: string;
  parent: DomElement | null;
  children: DomElement[];
}

function buildDomTree(rootDivRef: React.RefObject<HTMLDivElement>): DomTree {
  if (!rootDivRef.current) {
    throw new Error("There is no Root div reference");
  }

  const buildElement = (
    node: HTMLElement,
    parent: DomElement | null
  ): DomElement => {
    const id = node.id || `id-${Math.random().toString(36).substring(2, 9)}`;

    const element: DomElement = {
      id,
      tagName: node.tagName.toLowerCase(),
      parent,
      children: [],
    };

    Array.from(node.children).forEach((childNode) => {
      if (childNode instanceof HTMLElement) {
        const childElement = buildElement(childNode, element);
        element.children.push(childElement);
      }
    });

    return element;
  };

  const rootElement = buildElement(rootDivRef.current, null);
  return { root: rootElement };
}

function findElementById(tree: DomTree, id: string): DomElement | null {
  return findNode(
    tree as unknown as Tree<DomData>,
    id,
    (node) => (node as unknown as DomElement).id
  ) as unknown as DomElement | null;
}

function insertElement(tree: DomTree, element: DomElement): void {
  if (!element.parent) {
    console.error("Cannot add a new root element");
    return;
  }
  const parentElement = findElementById(tree, element.parent.id);
  if (!parentElement) {
    console.error(`Parent element with ID ${element.parent.id} not found`);
    return;
  }
  parentElement.children.push(element);
  const parentNode = document.getElementById(parentElement.id);
  if (!parentNode) {
    console.error(`Parent DOM node with ID ${parentElement.id} not found`);
    return;
  }

  const newNode = document.createElement(element.tagName);
  newNode.id = element.id;
  parentNode.appendChild(newNode);
}

function deleteElementById(tree: DomTree, id: string): void {
  if (tree.root.id === id) {
    console.error("Cannot delete the root element");
    return;
  }

  const elementToDelete = findElementById(tree, id);
  if (!elementToDelete) {
    console.error(`Element with ID ${id} not found`);
    return;
  }

  const parent = elementToDelete.parent;
  if (!parent) {
    console.error(`Element with ID ${id} has no parent`);
    return;
  }

  const index = parent.children.findIndex((child) => child.id === id);
  if (index !== -1) {
    parent.children.splice(index, 1);
  }

  const nodeToDelete = document.getElementById(id);
  if (nodeToDelete && nodeToDelete.parentNode) {
    nodeToDelete.parentNode.removeChild(nodeToDelete);
  }
}

const DomTreeRenderer: React.FC<{ tree: DomTree }> = ({ tree }) => {
  const renderElement = (element: DomElement, depth: number = 0) => {
    const indent = depth * 20;

    return (
      <div key={element.id}>
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100"
          style={{ paddingLeft: `${indent}px` }}
        >
          <span className="px-2 py-1 text-blue-600">
            &lt;{element.tagName}&gt;
          </span>
          <span className="text-gray-500 text-sm ml-2">id: {element.id}</span>
        </div>
        {element.children.map((child) => renderElement(child, depth + 1))}
        <div
          className="flex items-center hover:bg-gray-100"
          style={{ paddingLeft: `${indent}px` }}
        >
          <span className="px-2 py-1 text-blue-600">
            &lt;/{element.tagName}&gt;
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
  const [tree, setTree] = useState<DomTree | null>(null);
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
      const parentElement = selectedId
        ? findElementById(tree, selectedId)
        : tree.root;

      if (!parentElement) {
        setMessage(`Parent element with ID ${selectedId} not found`);
        return;
      }

      const newElement: DomElement = {
        id: newId || `random-id-${Math.random().toString(36).substring(2, 9)}`,
        tagName: newTagName,
        parent: parentElement,
        children: [],
      };

      insertElement(tree, newElement);

      setTree({ ...tree });
      setNewId("");
      setMessage(
        `Element <${newTagName}> created under ${parentElement.tagName}#${parentElement.id}`
      );
    } catch (error) {
      setMessage(`Error creating element: ${error}`);
    }
  };

  const handleDeleteElement = () => {
    if (!tree || !selectedId || selectedId === tree.root.id) return;

    try {
      deleteElementById(tree, selectedId);

      setTree({ ...tree });
      setSelectedId(tree.root.id);
      setMessage(`Element with ID ${selectedId} deleted`);
    } catch (error) {
      setMessage(`Error deleting element: ${error}`);
    }
  };

  const ElementSelector: React.FC<{
    element: DomElement;
    depth?: number;
    onSelect: (id: string) => void;
  }> = ({ element, depth = 0, onSelect }) => {
    const isSelected = selectedId === element.id;
    const indent = depth * 20;

    return (
      <div>
        <div
          className={`flex items-center cursor-pointer ${
            isSelected ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => onSelect(element.id)}
        >
          <span className="text-blue-600">&lt;{element.tagName}&gt;</span>
          <span className="text-gray-500 text-sm ml-2">id: {element.id}</span>
        </div>

        {element.children.map((child, index) => (
          <ElementSelector
            key={index}
            element={child}
            depth={depth + 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
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
          <div className="bg-white p-4 border rounded h-96 overflow-auto">
            {tree ? (
              <ElementSelector
                element={tree.root}
                onSelect={(id) => setSelectedId(id)}
              />
            ) : (
              <div>Loading DOM tree...</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">DOM Operations</div>
          <div className="bg-white p-4 border rounded">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">
                Selected element: {selectedId ? `${selectedId}` : "None"}
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    className="border p-2"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="please input ur html tag.. (div, span, etc.)"
                  />
                  <input
                    type="text"
                    className="border p-2"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="enter your element id (optional)"
                  />
                </div>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2"
                  onClick={handleAddElement}
                  disabled={!newTagName}
                >
                  Add element to selected parent
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleDeleteElement}
                  disabled={!selectedId || selectedId === tree?.root.id}
                >
                  Delete selected element
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 font-semibold">Rendered DOM Tree</div>
            {tree && <DomTreeRenderer tree={tree} />}
          </div>

          <div className="mt-4 text-sm text-gray-600 p-2 border bg-gray-50">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactDomTree;
