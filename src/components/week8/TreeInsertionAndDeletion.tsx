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
    if (minDegree < 2) {
      throw new Error("Minimum degree must be at least 2");
    }
    
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
      splitChild(tree, newRoot, 0);
      insertNonFull(tree, newRoot, key);
    } else {
      insertNonFull(tree, root, key);
    }
  }

  function insertNonFull(tree: BTree, node: BTreeNode, key: number): void {
    const t = tree.minDegree;
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
        splitChild(tree, node, i);
        if (key > node.keys[i]) {
          i++;
        }
      }

      insertNonFull(tree, node.children[i], key);
    }
  }

  function splitChild(tree: BTree, parent: BTreeNode, index: number): void {
    const t = tree.minDegree;
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
    if (!tree.root || tree.root.keys.length === 0) {
      return;
    }
    
    const t = tree.minDegree;
    deleteKeyFromNode(tree, tree.root, key);

    if (tree.root.keys.length === 0 && !tree.root.isLeaf) {
      tree.root = tree.root.children[0];
    }
  }

  function deleteKeyFromNode(tree: BTree, node: BTreeNode, key: number): void {
    const t = tree.minDegree;
    let index = findKeyIndex(node, key);

    if (index < node.keys.length && node.keys[index] === key) {
      if (node.isLeaf) {
        node.keys.splice(index, 1);
      } else {
        deleteFromInternalNode(tree, node, index);
      }
    } else if (!node.isLeaf) {
      const childIndex = index;
      const child = node.children[childIndex];
      
      if (child.keys.length < t) {
        fillChild(tree, node, childIndex);
        return deleteKeyFromNode(tree, node, key);
      }

      deleteKeyFromNode(tree, node.children[childIndex], key);
    }
  }

  function findKeyIndex(node: BTreeNode, key: number): number {
    let index = 0;
    while (index < node.keys.length && key > node.keys[index]) {
      index++;
    }
    return index;
  }

  function deleteFromInternalNode(tree: BTree, node: BTreeNode, index: number): void {
    const t = tree.minDegree;
    const keyToDelete = node.keys[index];

    if (node.children[index].keys.length >= t) {
      const predecessor = getPredecessor(node.children[index]);
      node.keys[index] = predecessor;
      deleteKeyFromNode(tree, node.children[index], predecessor);
    } else if (node.children[index + 1].keys.length >= t) {
      const successor = getSuccessor(node.children[index + 1]);
      node.keys[index] = successor;
      deleteKeyFromNode(tree, node.children[index + 1], successor);
    } else {
      mergeNodes(tree, node, index);
      deleteKeyFromNode(tree, node.children[index], keyToDelete);
    }
  }

  function getSuccessor(node: BTreeNode): number {
    let current = node;
    while (!current.isLeaf) {
      current = current.children[0];
    }
    return current.keys[0];
  }

  function getPredecessor(node: BTreeNode): number {
    let current = node;
    while (!current.isLeaf) {
      current = current.children[current.children.length - 1];
    }
    return current.keys[current.keys.length - 1];
  }

  function fillChild(tree: BTree, parent: BTreeNode, index: number): void {
    const t = tree.minDegree;
    
    if (index > 0 && parent.children[index - 1].keys.length >= t) {
      borrowFromPrev(parent, index);
    } else if (index < parent.children.length - 1 && parent.children[index + 1].keys.length >= t) {
      borrowFromNext(parent, index);
    } else {
      if (index < parent.children.length - 1) {
        mergeNodes(tree, parent, index);
      } else {
        mergeNodes(tree, parent, index - 1);
      }
    }
  }

  function borrowFromPrev(parent: BTreeNode, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index - 1];

    child.keys.unshift(parent.keys[index - 1]);
    
    if (sibling.keys.length > 0) {
      parent.keys[index - 1] = sibling.keys[sibling.keys.length - 1];
      sibling.keys.pop();
      
      if (!child.isLeaf && sibling.children.length > 0) {
        child.children.unshift(sibling.children[sibling.children.length - 1]);
        sibling.children.pop();
      }
    }
  }

  function borrowFromNext(parent: BTreeNode, index: number): void {
    const child = parent.children[index];
    const sibling = parent.children[index + 1];

    child.keys.push(parent.keys[index]);
    
    if (sibling.keys.length > 0) {
      parent.keys[index] = sibling.keys[0];
      sibling.keys.shift();
      
      if (!child.isLeaf && sibling.children.length > 0) {
        child.children.push(sibling.children[0]);
        sibling.children.shift();
      }
    }
  }

  function mergeNodes(tree: BTree, parent: BTreeNode, index: number): void {
    const t = tree.minDegree;
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