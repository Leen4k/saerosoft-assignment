import React from "react";
import { Tree, TreeNode } from "../../utils/collections/tree";

export interface TreeViewProps<T> {
  tree: Tree<T>;
  selectedId: string;
  onSelect: (id: string) => void;
  renderNode: (node: TreeNode<T>, isSelected: boolean) => React.ReactNode;
  expandedIds?: Set<string>;
  onToggleExpand?: (id: string) => void;
  indentSize?: number;
}

export function TreeView<T>({
  tree,
  selectedId,
  onSelect,
  renderNode,
  expandedIds,
  onToggleExpand,
  indentSize = 20,
}: TreeViewProps<T>): React.ReactElement {
  const renderTreeNode = (
    node: TreeNode<T>,
    depth: number = 0
  ): React.ReactElement => {
    const isSelected = selectedId === node.id;
    const isExpanded = expandedIds ? expandedIds.has(node.id) : true;
    const indent = depth * indentSize;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(node.id);
    };

    const handleToggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleExpand) {
        onToggleExpand(node.id);
      }
    };

    return (
      <div key={node.id}>
        <div
          className={`flex items-center cursor-pointer ${
            isSelected ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleClick}
          onDoubleClick={onToggleExpand ? handleToggleExpand : undefined}
        >
          {renderNode(node, isSelected)}
        </div>

        {isExpanded &&
          node.children.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 border rounded h-96 overflow-auto">
      {tree ? renderTreeNode(tree.root) : <div>Loading tree...</div>}
    </div>
  );
}
