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
