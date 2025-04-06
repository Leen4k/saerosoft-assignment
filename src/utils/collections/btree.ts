import { AbstractTree } from "./tree";

export interface BTreeNodeData<K, V> {
  keys: K[];
  values: V[];
  isLeaf: boolean;
}

export class BTreeNode<K, V> {
  keys: K[];
  values: V[];
  children: BTreeNode<K, V>[];
  isLeaf: boolean;

  constructor(isLeaf: boolean = true) {
    this.keys = [];
    this.values = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

export class BTree<K, V> extends AbstractTree<
  BTreeNode<K, V>,
  BTreeNodeData<K, V>
> {
  minDegree: number;

  constructor(minDegree: number) {
    if (minDegree < 2) {
      throw new Error("Minimum degree must be at least 2");
    }

    const root = new BTreeNode<K, V>(true);
    super(root);
    this.minDegree = minDegree;
  }

  findNodeById(id: string): BTreeNode<K, V> | null {
    console.error("findNodeById not applicable for B-tree");
    return null;
  }

  deleteNodeById(id: string): boolean {
    console.error("deleteNodeById not applicable for B-tree");
    return false;
  }

  insertNode(parentId: string, newNode: BTreeNode<K, V>): boolean {
    console.error("insertNode not applicable for B-tree");
    return false;
  }

  private findKeyIndex(node: BTreeNode<K, V>, key: K): number {
    let index = 0;
    while (
      index < node.keys.length &&
      this.compare(key, node.keys[index]) > 0
    ) {
      index++;
    }
    return index;
  }

  protected compare(a: K, b: K): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  private splitChild(parent: BTreeNode<K, V>, index: number): void {
    const t = this.minDegree;
    const child = parent.children[index];
    const newChild = new BTreeNode<K, V>(child.isLeaf);

    const medianIndex = t - 1;
    const medianKey = child.keys[medianIndex];
    const medianValue = child.values[medianIndex];

    for (let i = medianIndex + 1; i < child.keys.length; i++) {
      newChild.keys.push(child.keys[i]);
      newChild.values.push(child.values[i]);
    }

    if (!child.isLeaf) {
      for (let i = medianIndex + 1; i < child.children.length; i++) {
        newChild.children.push(child.children[i]);
      }
      child.children.length = medianIndex + 1;
    }

    child.keys.length = medianIndex;
    child.values.length = medianIndex;

    parent.keys.splice(index, 0, medianKey);
    parent.values.splice(index, 0, medianValue);
    parent.children.splice(index + 1, 0, newChild);
  }

  private insertNonFull(node: BTreeNode<K, V>, key: K, value: V): void {
    const t = this.minDegree;
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        i--;
      }

      const insertIndex = i + 1;

      if (i >= 0 && this.compare(key, node.keys[i]) === 0) {
        node.values[i] = value;
        return;
      }

      node.keys.splice(insertIndex, 0, key);
      node.values.splice(insertIndex, 0, value);
    } else {
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        i--;
      }

      i++;

      if (node.children[i].keys.length === 2 * t - 1) {
        this.splitChild(node, i);
        if (this.compare(key, node.keys[i]) > 0) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key, value);
    }
  }

  insert(key: K, value: V): void {
    const root = this.root;
    const t = this.minDegree;
    if (root.keys.length === 2 * t - 1) {
      const newRoot = new BTreeNode<K, V>(false);
      newRoot.children.push(root);
      this.root = newRoot;
      this.splitChild(newRoot, 0);
      this.insertNonFull(newRoot, key, value);
    } else {
      this.insertNonFull(root, key, value);
    }
  }

  search(key: K): V | null {
    return this.searchNode(this.root, key);
  }

  private searchNode(node: BTreeNode<K, V>, key: K): V | null {
    let i = 0;
    while (i < node.keys.length && this.compare(key, node.keys[i]) > 0) {
      i++;
    }

    if (i < node.keys.length && this.compare(key, node.keys[i]) === 0) {
      return node.values[i];
    }

    if (node.isLeaf) {
      return null;
    }

    return this.searchNode(node.children[i], key);
  }

  private getPredecessor(node: BTreeNode<K, V>): { key: K; value: V } {
    let current = node;
    while (!current.isLeaf) {
      current = current.children[current.children.length - 1];
    }
    const index = current.keys.length - 1;
    return { key: current.keys[index], value: current.values[index] };
  }

  private getSuccessor(node: BTreeNode<K, V>): { key: K; value: V } {
    let current = node;
    while (!current.isLeaf) {
      current = current.children[0];
    }
    return { key: current.keys[0], value: current.values[0] };
  }

  private borrowFromPrev(parent: BTreeNode<K, V>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index - 1];

    child.keys.unshift(parent.keys[index - 1]);
    child.values.unshift(parent.values[index - 1]);

    parent.keys[index - 1] = sibling.keys[sibling.keys.length - 1];
    parent.values[index - 1] = sibling.values[sibling.values.length - 1];

    sibling.keys.pop();
    sibling.values.pop();

    if (!child.isLeaf) {
      child.children.unshift(sibling.children[sibling.children.length - 1]);
      sibling.children.pop();
    }
  }

  private borrowFromNext(parent: BTreeNode<K, V>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    child.values.push(parent.values[index]);

    parent.keys[index] = sibling.keys[0];
    parent.values[index] = sibling.values[0];

    sibling.keys.shift();
    sibling.values.shift();

    if (!child.isLeaf) {
      child.children.push(sibling.children[0]);
      sibling.children.shift();
    }
  }

  private mergeNodes(parent: BTreeNode<K, V>, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    child.values.push(parent.values[index]);

    child.keys.push(...sibling.keys);
    child.values.push(...sibling.values);

    if (!child.isLeaf) {
      child.children.push(...sibling.children);
    }

    parent.keys.splice(index, 1);
    parent.values.splice(index, 1);
    parent.children.splice(index + 1, 1);
  }

  private fillChild(parent: BTreeNode<K, V>, index: number): void {
    const t = this.minDegree;

    if (index > 0 && parent.children[index - 1].keys.length >= t) {
      this.borrowFromPrev(parent, index);
    } else if (
      index < parent.children.length - 1 &&
      parent.children[index + 1].keys.length >= t
    ) {
      this.borrowFromNext(parent, index);
    } else {
      if (index < parent.children.length - 1) {
        this.mergeNodes(parent, index);
      } else {
        this.mergeNodes(parent, index - 1);
      }
    }
  }

  private deleteFromInternalNode(node: BTreeNode<K, V>, index: number): void {
    const t = this.minDegree;
    const keyToDelete = node.keys[index];

    if (node.children[index].keys.length >= t) {
      const { key, value } = this.getPredecessor(node.children[index]);
      node.keys[index] = key;
      node.values[index] = value;
      this.deleteKeyFromNode(node.children[index], key);
    } else if (node.children[index + 1].keys.length >= t) {
      const { key, value } = this.getSuccessor(node.children[index + 1]);
      node.keys[index] = key;
      node.values[index] = value;
      this.deleteKeyFromNode(node.children[index + 1], key);
    } else {
      this.mergeNodes(node, index);
      this.deleteKeyFromNode(node.children[index], keyToDelete);
    }
  }

  private deleteKeyFromNode(node: BTreeNode<K, V>, key: K): void {
    const t = this.minDegree;
    let index = this.findKeyIndex(node, key);

    if (index < node.keys.length && this.compare(node.keys[index], key) === 0) {
      if (node.isLeaf) {
        node.keys.splice(index, 1);
        node.values.splice(index, 1);
      } else {
        this.deleteFromInternalNode(node, index);
      }
    } else if (!node.isLeaf) {
      const childIndex = index;
      const child = node.children[childIndex];

      if (child.keys.length < t) {
        this.fillChild(node, childIndex);
        return this.deleteKeyFromNode(node, key);
      }

      this.deleteKeyFromNode(node.children[childIndex], key);
    }
  }

  delete(key: K): void {
    if (!this.root || this.root.keys.length === 0) {
      return;
    }

    this.deleteKeyFromNode(this.root, key);

    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.root = this.root.children[0];
    }
  }

  traverse(callback: (node: BTreeNode<K, V>, level: number) => void): void {
    this.traverseNode(this.root, callback, 0);
  }

  private traverseNode(
    node: BTreeNode<K, V>,
    callback: (node: BTreeNode<K, V>, level: number) => void,
    level: number
  ): void {
    callback(node, level);

    if (!node.isLeaf) {
      for (const child of node.children) {
        this.traverseNode(child, callback, level + 1);
      }
    }
  }

  toString(): string {
    let result = "";
    this.traverse((node, level) => {
      const indent = "  ".repeat(level);
      const nodeInfo = node.keys
        .map((key, i) => `(${String(key)},${String(node.values[i])})`)
        .join(",");
      result += `${indent}${nodeInfo}\n`;
    });
    return result;
  }
}
