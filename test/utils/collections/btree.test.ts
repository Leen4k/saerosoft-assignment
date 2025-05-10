import { BTree, BTreeNode } from "../../../src/utils/collections/btree";

describe("BTree", () => {
  describe("constructor", () => {
    it("should create an empty BTree with given minimum degree", () => {
      const btree = new BTree<number, string>(2);
      expect(btree.minDegree).toBe(2);
      expect(btree.root).toBeDefined();
      expect(btree.root.isLeaf).toBeTruthy();
      expect(btree.root.keys).toHaveLength(0);
      expect(btree.root.values).toHaveLength(0);
    });

    it("should throw error if minimum degree is less than 2", () => {
      expect(() => new BTree<number, string>(1)).toThrow(
        "Minimum degree must be at least 2"
      );
    });
  });

  describe("insert", () => {
    let btree: BTree<number, string>;

    beforeEach(() => {
      btree = new BTree<number, string>(2);
    });

    it("should insert a key-value pair into an empty tree", () => {
      btree.insert(10, "ten");

      expect(btree.root.keys).toHaveLength(1);
      expect(btree.root.keys[0]).toBe(10);
      expect(btree.root.values[0]).toBe("ten");
    });

    it("should insert multiple key-value pairs in order", () => {
      btree.insert(10, "ten");
      btree.insert(20, "twenty");
      btree.insert(30, "thirty");

      expect(btree.root.keys).toHaveLength(3);
      expect(btree.root.keys).toEqual([10, 20, 30]);
      expect(btree.root.values).toEqual(["ten", "twenty", "thirty"]);
    });

    it("should insert key-value pairs in correct order regardless of insertion order", () => {
      btree.insert(30, "thirty");
      btree.insert(10, "ten");
      btree.insert(20, "twenty");

      expect(btree.root.keys).toHaveLength(3);
      expect(btree.root.keys).toEqual([10, 20, 30]);
      expect(btree.root.values).toEqual(["ten", "twenty", "thirty"]);
    });

    it("should update value if key already exists", () => {
      btree.insert(10, "ten");
      btree.insert(10, "new ten");

      expect(btree.root.keys).toHaveLength(1);
      expect(btree.root.keys[0]).toBe(10);
      expect(btree.root.values[0]).toBe("new ten");
    });

    it("should split the root when it becomes full", () => {
      btree.insert(10, "ten");
      btree.insert(20, "twenty");
      btree.insert(30, "thirty");

      expect(btree.root.keys).toHaveLength(3);

      btree.insert(40, "forty");

      expect(btree.root.isLeaf).toBeFalsy();
      expect(btree.root.keys).toHaveLength(1);
      expect(btree.root.keys[0]).toBe(20);
      expect(btree.root.children).toHaveLength(2);

      expect(btree.root.children[0].keys).toEqual([10]);
      expect(btree.root.children[1].keys).toEqual([30, 40]);
    });
  });

  describe("search", () => {
    let btree: BTree<number, string>;

    beforeEach(() => {
      btree = new BTree<number, string>(2);
      btree.insert(10, "ten");
      btree.insert(20, "twenty");
      btree.insert(30, "thirty");
      btree.insert(40, "forty");
      btree.insert(50, "fifty");
    });

    it("should find an existing key", () => {
      expect(btree.search(10)).toBe("ten");
      expect(btree.search(20)).toBe("twenty");
      expect(btree.search(30)).toBe("thirty");
      expect(btree.search(40)).toBe("forty");
      expect(btree.search(50)).toBe("fifty");
    });

    it("should return null for non-existing key", () => {
      expect(btree.search(15)).toBeNull();
      expect(btree.search(100)).toBeNull();
    });
  });

  describe("delete", () => {
    let btree: BTree<number, string>;

    beforeEach(() => {
      btree = new BTree<number, string>(2);
      btree.insert(10, "ten");
      btree.insert(20, "twenty");
      btree.insert(30, "thirty");
      btree.insert(40, "forty");
      btree.insert(50, "fifty");
      btree.insert(60, "sixty");
      btree.insert(70, "seventy");
    });

    it("should delete a leaf node key", () => {
      btree.delete(10);
      expect(btree.search(10)).toBeNull();
    });

    it("should delete a key from an internal node", () => {
      expect(btree.root.isLeaf).toBeFalsy();

      btree.delete(20);
      expect(btree.search(20)).toBeNull();
    });

    it("should do nothing when deleting a non-existent key", () => {
      const beforeState = btree.toString();
      btree.delete(999);
      const afterState = btree.toString();
      expect(beforeState).toBe(afterState);
    });

    it("should maintain tree properties after multiple deletions", () => {
      btree.delete(30);
      btree.delete(50);
      btree.delete(10);

      expect(btree.search(30)).toBeNull();
      expect(btree.search(50)).toBeNull();
      expect(btree.search(10)).toBeNull();

      expect(btree.search(20)).toBe("twenty");
      expect(btree.search(40)).toBe("forty");
      expect(btree.search(60)).toBe("sixty");
      expect(btree.search(70)).toBe("seventy");
    });
  });

  describe("traverse", () => {
    let btree: BTree<number, string>;

    beforeEach(() => {
      btree = new BTree<number, string>(2);
      btree.insert(10, "ten");
      btree.insert(20, "twenty");
      btree.insert(30, "thirty");
    });

    it("should visit all nodes in the correct order", () => {
      const visitedNodes: BTreeNode<number, string>[] = [];
      const visitedLevels: number[] = [];

      btree.traverse((node, level) => {
        visitedNodes.push(node);
        visitedLevels.push(level);
      });

      expect(visitedNodes.length).toBeGreaterThan(0);
      expect(visitedNodes[0]).toBe(btree.root);
      expect(visitedLevels[0]).toBe(0);

      for (let i = 1; i < visitedLevels.length; i++) {
        expect(visitedLevels[i]).toBeGreaterThanOrEqual(visitedLevels[i - 1]);
      }
    });
  });

  describe("toString", () => {
    it("should return a string representation of the tree", () => {
      const btree = new BTree<number, string>(2);
      btree.insert(10, "ten");
      btree.insert(20, "twenty");

      const result = btree.toString();

      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("(10,ten)");
      expect(result).toContain("(20,twenty)");
    });
  });

  describe("AbstractTree methods", () => {
    let btree: BTree<number, string>;

    beforeEach(() => {
      btree = new BTree<number, string>(2);
    });

    it("should return null for findNodeById (not applicable for B-tree)", () => {
      expect(btree.findNodeById("any-id")).toBeNull();
    });

    it("should return false for deleteNodeById (not applicable for B-tree)", () => {
      expect(btree.deleteNodeById("any-id")).toBeFalsy();
    });

    it("should return false for insertNode (not applicable for B-tree)", () => {
      const newNode = new BTreeNode<number, string>(true);
      expect(btree.insertNode("any-id", newNode)).toBeFalsy();
    });
  });

  describe("edge cases", () => {
    it("should handle large number of insertions", () => {
      const btree = new BTree<number, string>(3);
      const numElements = 100;

      for (let i = 0; i < numElements; i++) {
        btree.insert(i, `value-${i}`);
      }

      for (let i = 0; i < numElements; i++) {
        expect(btree.search(i)).toBe(`value-${i}`);
      }
    });

    it("should handle string keys", () => {
      const btree = new BTree<string, number>(2);

      btree.insert("apple", 1);
      btree.insert("banana", 2);
      btree.insert("cherry", 3);

      expect(btree.search("apple")).toBe(1);
      expect(btree.search("banana")).toBe(2);
      expect(btree.search("cherry")).toBe(3);
      expect(btree.search("dragonfruit")).toBeNull();
    });
  });
});
