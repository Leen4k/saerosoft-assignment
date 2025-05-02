import { BTree } from "../../../src/utils/collections/btree";

function displayTree<K, V>(tree: BTree<K, V>, description: string): void {
  console.log(`\n${description}:`);
  console.log(tree.toString());
}

describe("BTree", () => {
  describe("basic operations", () => {
    let tree: BTree<number, string>;

    beforeEach(() => {
      tree = new BTree<number, string>(3);
    });

    test("should correctly insert and search key-value pairs", () => {
      tree.insert(10, "ten");
      tree.insert(20, "twenty");
      tree.insert(5, "five");

      displayTree(tree, "After inserting 10, 20, 5");

      expect(tree.search(10)).toBe("ten");
      expect(tree.search(20)).toBe("twenty");
      expect(tree.search(5)).toBe("five");
      expect(tree.search(30)).toBeNull();
    });

    test("should update value if key already exists", () => {
      tree.insert(10, "ten");
      tree.insert(10, "TEN");

      expect(tree.search(10)).toBe("TEN");
    });

    test("should delete keys correctly", () => {
      tree.insert(10, "ten");
      tree.insert(20, "twenty");
      tree.insert(5, "five");
      tree.insert(15, "fifteen");
      tree.insert(25, "twenty-five");

      displayTree(tree, "After inserting 10, 20, 5, 15, 25");

      tree.delete(15);
      displayTree(tree, "After deleting 15");

      expect(tree.search(15)).toBeNull();

      expect(tree.search(10)).toBe("ten");
      expect(tree.search(20)).toBe("twenty");
      expect(tree.search(5)).toBe("five");
      expect(tree.search(25)).toBe("twenty-five");
    });
  });

  describe("complex operations with root splitting", () => {
    test("should correctly handle root splitting", () => {
      const tree = new BTree<number, string>(2);

      tree.insert(10, "ten");
      tree.insert(20, "twenty");
      tree.insert(30, "thirty");

      displayTree(tree, "After inserting 10, 20, 30 (root should split)");

      tree.insert(40, "forty");
      tree.insert(50, "fifty");
      tree.insert(60, "sixty");
      tree.insert(70, "seventy");
      tree.insert(80, "eighty");
      tree.insert(90, "ninety");

      displayTree(tree, "After inserting more keys (complex tree)");

      expect(tree.search(10)).toBe("ten");
      expect(tree.search(20)).toBe("twenty");
      expect(tree.search(30)).toBe("thirty");
      expect(tree.search(40)).toBe("forty");
      expect(tree.search(50)).toBe("fifty");
      expect(tree.search(60)).toBe("sixty");
      expect(tree.search(70)).toBe("seventy");
      expect(tree.search(80)).toBe("eighty");
      expect(tree.search(90)).toBe("ninety");
    });
  });

  describe("complex deletion operations", () => {
    test("should handle complex deletion scenarios", () => {
      const tree = new BTree<number, string>(2);

      [50, 30, 70, 10, 40, 60, 80, 5, 15, 35, 45, 55, 65, 75, 85].forEach(
        (key) => {
          tree.insert(key, key.toString());
        }
      );

      displayTree(tree, "Initial complex tree");

      tree.delete(5);
      displayTree(tree, "After deleting leaf key 5");
      expect(tree.search(5)).toBeNull();

      tree.delete(30);
      displayTree(tree, "After deleting internal key 30");
      expect(tree.search(30)).toBeNull();

      tree.delete(35);
      displayTree(tree, "After deleting key 35 (may require borrowing)");
      expect(tree.search(35)).toBeNull();

      tree.delete(40);
      tree.delete(45);
      displayTree(tree, "After deleting keys 40 and 45 (may require merging)");
      expect(tree.search(40)).toBeNull();
      expect(tree.search(45)).toBeNull();

      [10, 15, 50, 55, 60, 65, 70, 75, 80, 85].forEach((key) => {
        expect(tree.search(key)).toBe(key.toString());
      });
    });
  });

  describe("extreme cases", () => {
    test("should handle a large number of insertions and deletions", () => {
      const tree = new BTree<number, string>(3);
      const maxKey = 100;
      for (let i = 1; i <= maxKey; i++) {
        tree.insert(i, `value-${i}`);
      }

      displayTree(tree, "After inserting 100 keys");
      [1, 25, 50, 75, 100].forEach((key) => {
        expect(tree.search(key)).toBe(`value-${key}`);
      });
      for (let i = 2; i <= maxKey; i += 2) {
        tree.delete(i);
      }

      displayTree(tree, "After deleting even keys");

      for (let i = 1; i <= maxKey; i++) {
        if (i % 2 === 0) {
          expect(tree.search(i)).toBeNull();
        } else {
          expect(tree.search(i)).toBe(`value-${i}`);
        }
      }
    });
  });
});

describe("BTree insert step-by-step", () => {
  let tree: BTree<number, number>;

  beforeEach(() => (tree = new BTree<number, number>(3)));

  test("insert 10", () => {
    [10].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([10]);
  });

  test("insert 10, 20", () => {
    [10, 20].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([10, 20]);
  });

  test("insert 10, 20, 5", () => {
    [10, 20, 5].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([5, 10, 20]);
  });

  test("insert 10, 20, 5, 6", () => {
    [10, 20, 5, 6].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([5, 6, 10, 20]);
  });

  test("insert 10, 20, 5, 6, 12", () => {
    [10, 20, 5, 6, 12].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([5, 6, 10, 12, 20]);
  });

  test("insert 10, 20, 5, 6, 12, 30", () => {
    [10, 20, 5, 6, 12, 30].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([10]);
    const [left, right] = tree.root.children!;
    expect(left.keys).toEqual([5, 6]);
    expect(right.keys).toEqual([12, 20, 30]);
  });

  test("insert 10, 20, 5, 6, 12, 30, 7", () => {
    [10, 20, 5, 6, 12, 30, 7].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([10]);
    const [left, right] = tree.root.children!;
    expect(left.keys).toEqual([5, 6, 7]);
    expect(right.keys).toEqual([12, 20, 30]);
  });

  test("insert 10, 20, 5, 6, 12, 30, 7, 17", () => {
    [10, 20, 5, 6, 12, 30, 7, 17].forEach((n) => tree.insert(n, n));
    console.log("Tree:\n" + tree.toString());

    expect(tree.root.keys).toEqual([10]);
    const [left, right] = tree.root.children!;
    expect(left.keys).toEqual([5, 6, 7]);
    expect(right.keys).toEqual([12, 17, 20, 30]);
  });

  test("bTree with depth 2 having maximum elements", () => {
    Array.from({ length: 18 }).forEach((_, i) => tree.insert(i + 1, i + 1));
    console.log("Tree:\n" + tree.toString());

    const root = tree.root;
    expect(root).toBeDefined();
    expect(root.children).toBeDefined();

    const hasGrandchildren = root.children!.some(
      (child) => child.children && child.children.length > 0
    );
    expect(hasGrandchildren).toBe(false);
  });

  test("bTree with depth 3 having minimum elements", () => {
    Array.from({ length: 19 }).forEach((_, i) => tree.insert(i + 1, i + 1));
    console.log("Tree:\n" + tree.toString());

    const root = tree.root;
    expect(root).toBeDefined();
    expect(root.children).toBeDefined();

    const hasGrandchildren = root.children!.some(
      (child) => child.children && child.children.length > 0
    );
    expect(hasGrandchildren).toBe(true);
  });
});

describe("BTree delete step-by-step", () => {
  let tree: BTree<number, number>;

  test("delete from leaf node", () => {
    tree = new BTree<number, number>(3);
    [10, 20, 30, 5, 15, 25, 35].forEach((n) => tree.insert(n, n));
    console.log("Tree before deletion:\n" + tree.toString());

    const rootKeysBefore = [...tree.root.keys];
    const childrenBefore = tree.root.children!.map((child) => [...child.keys]);

    tree.delete(35);
    console.log("Tree after deleting 35 from leaf node:\n" + tree.toString());

    expect(tree.search(35)).toBeNull();

    [5, 10, 15, 20, 25, 30].forEach((key) => {
      expect(tree.search(key)).toBe(key);
    });

    expect(tree.root.keys).toEqual(rootKeysBefore);

    const rightmostChild = tree.root.children![tree.root.children!.length - 1];
    expect(rightmostChild.keys).not.toContain(35);
  });

  test("delete causing redistribution from left sibling", () => {
    tree = new BTree<number, number>(2);
    [10, 20, 30, 5, 15, 25, 35, 40].forEach((n) => tree.insert(n, n));
    console.log("Tree before deletion:\n" + tree.toString());

    const rootKeysBefore = [...tree.root.keys];
    const childrenBefore = tree.root.children!.map((child) => [...child.keys]);

    tree.delete(40);
    console.log(
      "Tree after deletion requiring redistribution:\n" + tree.toString()
    );

    expect(tree.search(40)).toBeNull();

    const rootKeysAfter = tree.root.keys;
    const childrenAfter = tree.root.children!.map((child) => [...child.keys]);

    expect(tree.root.children!.length).toBe(childrenBefore.length);

    const sameChildren = childrenBefore.every(
      (childKeys, index) =>
        JSON.stringify(childKeys) === JSON.stringify(childrenAfter[index])
    );

    expect(sameChildren).toBe(false);

    const rightmostChildKeys = childrenAfter[childrenAfter.length - 1];
    expect(rightmostChildKeys.length).toBeGreaterThanOrEqual(
      tree.minDegree - 1
    );
  });

  test("delete causing merge of nodes", () => {
    tree = new BTree<number, number>(2);
    [10, 20, 30, 40, 5, 15, 25, 35, 45].forEach((n) => tree.insert(n, n));
    console.log("Tree before deletion:\n" + tree.toString());

    tree.delete(5);
    tree.delete(15);
    console.log("Tree after deletions causing merge:\n" + tree.toString());

    expect(tree.search(5)).toBeNull();
    expect(tree.search(15)).toBeNull();
  });

  test("delete from internal node with successor", () => {
    tree = new BTree<number, number>(3);
    [50, 30, 70, 10, 40, 60, 80, 5, 20, 35, 45, 55, 65, 75, 85].forEach((n) =>
      tree.insert(n, n)
    );
    console.log("Tree before deletion:\n" + tree.toString());

    tree.delete(30);
    console.log("Tree after deleting internal node 30:\n" + tree.toString());

    expect(tree.search(30)).toBeNull();
    expect(tree.search(35)).toBe(35);
  });

  test("delete causing reduction in height", () => {
    tree = new BTree<number, number>(2);
    [10, 20, 30, 40, 50].forEach((n) => tree.insert(n, n));
    console.log("Tree before deletions:\n" + tree.toString());

    tree.delete(10);
    tree.delete(20);
    tree.delete(30);
    console.log(
      "Tree after deletions causing height reduction:\n" + tree.toString()
    );

    expect(tree.root.keys).toContain(40);
    expect(tree.root.keys).toContain(50);
    expect(tree.root.children).toEqual([]);
  });

  test("delete non-existent key", () => {
    tree = new BTree<number, number>(3);
    [10, 20, 30].forEach((n) => tree.insert(n, n));

    tree.delete(99);

    expect(tree.search(10)).toBe(10);
    expect(tree.search(20)).toBe(20);
    expect(tree.search(30)).toBe(30);
    expect(tree.search(99)).toBeNull();
  });
});
