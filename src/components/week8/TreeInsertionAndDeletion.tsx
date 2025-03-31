interface BTree {
  root: BTreeNode;
  minDegree: number;
}

interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
}

const TreeInsertionAndDeletion = () => {
  function createBTree(minDegree: number): BTree {
    return {
      root: {
        keys: [],
        children: [],
        isLeaf: true,
      },
      minDegree,
    };
  }

  function insertKey(tree: BTree, key: number): void {
    const root = tree.root;
    const t = tree.minDegree;

    if (root.keys.length === 2 * t - 1) {
      const newRoot: BTreeNode = {
        keys: [],
        children: [root],
        isLeaf: false,
      };

      tree.root = newRoot;
      splitChild(newRoot, 0);
      insertNonFull(newRoot, key);
    } else {
      insertNonFull(root, key);
    }
  }

  function insertNonFull(node: BTreeNode, key: number): void {
    const t =
      node.children.length > 0 ? Math.ceil(node.children.length / 2) : 2;
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      node.keys.splice(i + 1, 0, key);
    } else {
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === 2 * t - 1) {
        splitChild(node, i);
        if (key > node.keys[i]) {
          i++;
        }
      }

      insertNonFull(node.children[i], key);
    }
  }

  function splitChild(parent: BTreeNode, index: number): void {
    const t =
      parent.children.length > 0 ? Math.ceil(parent.children.length / 2) : 2;
    const child = parent.children[index];
    const newChild: BTreeNode = {
      keys: [],
      children: [],
      isLeaf: child.isLeaf,
    };

    const medianIndex = t - 1;
    const medianKey = child.keys[medianIndex];

    newChild.keys = child.keys.splice(medianIndex + 1);
    child.keys.pop();

    if (!child.isLeaf) {
      newChild.children = child.children.splice(medianIndex + 1);
    }

    parent.keys.splice(index, 0, medianKey);
    parent.children.splice(index + 1, 0, newChild);
  }

  function deleteKey(tree: BTree, key: number): void {
    const root = tree.root;
    const t = tree.minDegree;

    deleteKeyFromNode(root, key, t);

    if (root.keys.length === 0 && !root.isLeaf) {
      tree.root = root.children[0];
    }
  }

  function deleteKeyFromNode(node: BTreeNode, key: number, t: number): void {
    let index = findKeyIndex(node, key);

    if (index < node.keys.length && node.keys[index] === key) {
      if (node.isLeaf) {
        node.keys.splice(index, 1);
      } else {
        deleteFromInternalNode(node, index, t);
      }
    } else if (!node.isLeaf) {
      const child = node.children[index];

      if (child.keys.length < t) {
        fillChild(node, index, t);
        index = findKeyIndex(node, key);
      }

      deleteKeyFromNode(node.children[index], key, t);
    }
  }

  function findKeyIndex(node: BTreeNode, key: number): number {
    let index = 0;
    while (index < node.keys.length && key > node.keys[index]) {
      index++;
    }
    return index;
  }

  function deleteFromInternalNode(
    node: BTreeNode,
    index: number,
    t: number
  ): void {
    const keyToDelete = node.keys[index];

    if (node.children[index].keys.length >= t) {
      const predecessor = getPredecessor(node, index);
      node.keys[index] = predecessor;
      deleteKeyFromNode(node.children[index], predecessor, t);
    } else if (node.children[index + 1].keys.length >= t) {
      const successor = getSuccessor(node, index);
      node.keys[index] = successor;
      deleteKeyFromNode(node.children[index + 1], successor, t);
    } else {
      mergeNodes(node, index, t);
      deleteKeyFromNode(node.children[index], keyToDelete, t);
    }
  }

  function getSuccessor(node: BTreeNode, index: number): number {
    let current = node.children[index + 1];
    while (!current.isLeaf) {
      current = current.children[0];
    }
    return current.keys[0];
  }

  function getPredecessor(node: BTreeNode, index: number): number {
    let current = node.children[index];
    while (!current.isLeaf) {
      current = current.children[current.children.length - 1];
    }
    return current.keys[current.keys.length - 1];
  }

  function fillChild(parent: BTreeNode, index: number, t: number): void {
    if (index > 0 && parent.children[index - 1].keys.length >= t) {
      borrowFromPrev(parent, index, t);
    } else if (
      index < parent.children.length - 1 &&
      parent.children[index + 1].keys.length >= t
    ) {
      borrowFromNext(parent, index, t);
    } else {
      if (index < parent.children.length - 1) {
        mergeNodes(parent, index, t);
      } else {
        mergeNodes(parent, index - 1, t);
      }
    }
  }

  function borrowFromPrev(parent: BTreeNode, index: number, t: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index - 1];

    child.keys.unshift(parent.keys[index - 1]);
    parent.keys[index - 1] = sibling.keys.pop()!;

    if (!child.isLeaf) {
      child.children.unshift(sibling.children.pop()!);
    }
  }

  function borrowFromNext(parent: BTreeNode, index: number, t: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    parent.keys[index] = sibling.keys.shift()!;

    if (!child.isLeaf) {
      child.children.push(sibling.children.shift()!);
    }
  }

  function mergeNodes(parent: BTreeNode, index: number, t: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    child.keys.push(...sibling.keys);

    if (!child.isLeaf) {
      child.children.push(...sibling.children);
    }

    parent.keys.splice(index, 1);
    parent.children.splice(index + 1, 1);
  }

  return <div>B-Tree Implementation</div>;
};

export default TreeInsertionAndDeletion;
