import { TreeNode } from "../../types";

export interface Tree<T> {
  root: TreeNode<T>;
}

export function findNode<T, K>(
  tree: Tree<T>,
  key: K,
  keyExtractor: (node: TreeNode<T>) => K
): TreeNode<T> | null {
  const queue: TreeNode<T>[] = [tree.root];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (keyExtractor(current) === key) {
      return current;
    }

    queue.push(...current.children);
  }

  return null;
}

export function addNode<T>(parent: TreeNode<T>, data: T): TreeNode<T> {
  const newNode: TreeNode<T> = {
    data,
    parent,
    children: [],
  };

  parent.children.push(newNode);
  return newNode;
}

export function removeNode<T, K>(
  tree: Tree<T>,
  key: K,
  keyExtractor: (node: TreeNode<T>) => K
): boolean {
  const nodeToRemove = findNode(tree, key, keyExtractor);

  if (!nodeToRemove || nodeToRemove === tree.root || !nodeToRemove.parent) {
    return false;
  }

  const parent = nodeToRemove.parent;
  const index = parent.children.findIndex(
    (child) => keyExtractor(child) === key
  );

  if (index !== -1) {
    parent.children.splice(index, 1);
    return true;
  }

  return false;
}

export function getSiblings<T, K>(
  tree: Tree<T>,
  key: K,
  keyExtractor: (node: TreeNode<T>) => K
): TreeNode<T>[] {
  const node = findNode(tree, key, keyExtractor);

  if (!node || !node.parent) {
    return [];
  }

  return node.parent.children.filter((child) => keyExtractor(child) !== key);
}

export function getSubtree<T, K>(
  tree: Tree<T>,
  key: K,
  keyExtractor: (node: TreeNode<T>) => K
): Tree<T> | null {
  const node = findNode(tree, key, keyExtractor);

  if (!node) {
    return null;
  }

  return { root: node };
}

export function traverseDepthFirst<T>(
  node: TreeNode<T>,
  callback: (node: TreeNode<T>, depth: number) => void,
  depth: number = 0
): void {
  callback(node, depth);

  for (const child of node.children) {
    traverseDepthFirst(child, callback, depth + 1);
  }
}

export function traverseBreadthFirst<T>(
  tree: Tree<T>,
  callback: (node: TreeNode<T>, depth: number) => void
): void {
  const queue: Array<{ node: TreeNode<T>; depth: number }> = [
    { node: tree.root, depth: 0 },
  ];

  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;

    callback(node, depth);

    for (const child of node.children) {
      queue.push({ node: child, depth: depth + 1 });
    }
  }
}
