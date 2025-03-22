export interface TreeNodeData {
  id: string;
}

export class TreeNode<T> {
  id: string;
  data: T;
  parent: TreeNode<T> | null;
  children: TreeNode<T>[];

  constructor(
    id: string,
    data: T,
    parent: TreeNode<T> | null = null,
    children: TreeNode<T>[] = []
  ) {
    this.id = id;
    this.data = data;
    this.parent = parent;
    this.children = children;
  }
}

export class Tree<T> {
  root: TreeNode<T>;

  constructor(root: TreeNode<T>) {
    this.root = root;
  }

  static createNode<T>(
    id: string,
    data: T,
    parent: TreeNode<T> | null = null,
    children: TreeNode<T>[] = []
  ): TreeNode<T> {
    return new TreeNode<T>(id, data, parent, children);
  }

  findNodeById(id: string): TreeNode<T> | null {
    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.id === id) return current;
      queue.push(...current.children);
    }

    return null;
  }

  deleteNodeById(id: string): boolean {
    if (this.root.id === id) {
      console.error("Cannot delete the root node");
      return false;
    }

    const nodeToDelete = this.findNodeById(id);
    if (!nodeToDelete || !nodeToDelete.parent) {
      console.error(`Node with ID ${id} not found or has no parent`);
      return false;
    }

    const parent = nodeToDelete.parent;
    const index = parent.children.findIndex((child) => child.id === id);
    if (index !== -1) {
      parent.children.splice(index, 1);
      return true;
    }

    return false;
  }

  insertNode(parentId: string, newNode: TreeNode<T>): boolean {
    if (!newNode.parent) {
      console.error("New node must have a parent reference");
      return false;
    }

    const parentNode = this.findNodeById(parentId);
    if (!parentNode) {
      console.error(`Parent node with ID ${parentId} not found`);
      return false;
    }

    parentNode.children.push(newNode);
    return true;
  }

  traverseDepthFirst(
    callback: (node: TreeNode<T>, depth: number) => void,
    startNode: TreeNode<T> = this.root,
    depth: number = 0
  ): void {
    callback(startNode, depth);

    for (const child of startNode.children) {
      this.traverseDepthFirst(callback, child, depth + 1);
    }
  }

  traverseBreadthFirst(
    callback: (node: TreeNode<T>, depth: number) => void
  ): void {
    const queue: Array<{ node: TreeNode<T>; depth: number }> = [
      { node: this.root, depth: 0 },
    ];

    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;

      callback(node, depth);

      for (const child of node.children) {
        queue.push({ node: child, depth: depth + 1 });
      }
    }
  }
}

export function createTreeNode<T>(
  id: string,
  data: T,
  parent: TreeNode<T> | null = null,
  children: TreeNode<T>[] = []
): TreeNode<T> {
  return Tree.createNode(id, data, parent, children);
}

export function findNodeById<T>(tree: Tree<T>, id: string): TreeNode<T> | null {
  return tree.findNodeById(id);
}

export function deleteNodeById<T>(tree: Tree<T>, id: string): boolean {
  return tree.deleteNodeById(id);
}

export function insertNode<T>(
  tree: Tree<T>,
  parentId: string,
  newNode: TreeNode<T>
): boolean {
  return tree.insertNode(parentId, newNode);
}
