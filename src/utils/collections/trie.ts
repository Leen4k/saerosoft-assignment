import { AbstractTree } from "./tree";

export interface TrieNodeData {
  isEndOfWord: boolean;
}

export class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

export class Trie extends AbstractTree<TrieNode, TrieNodeData> {
  constructor() {
    const root = new TrieNode();
    super(root);
  }

  findNodeById(id: string): TrieNode | null {
    console.error("findNodeById not applicable for Trie");
    return null;
  }

  deleteNodeById(id: string): boolean {
    console.error("deleteNodeById not applicable for Trie");
    return false;
  }

  insertNode(parentId: string, newNode: TrieNode): boolean {
    console.error("insertNode not applicable for Trie");
    return false;
  }

  insert(word: string): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }

    return node.isEndOfWord;
  }

  findWordsWithPrefix(prefix: string): string[] {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }

    return this.collectWords(node, prefix);
  }

  private collectWords(node: TrieNode, prefix: string): string[] {
    const results: string[] = [];

    if (node.isEndOfWord) {
      results.push(prefix);
    }

    for (const char in node.children) {
      results.push(...this.collectWords(node.children[char], prefix + char));
    }

    return results;
  }

  traverse(callback: (node: TrieNode, prefix: string) => void): void {
    this.traverseNode(this.root, "", callback);
  }

  private traverseNode(
    node: TrieNode,
    prefix: string,
    callback: (node: TrieNode, prefix: string) => void
  ): void {
    callback(node, prefix);

    for (const char in node.children) {
      this.traverseNode(node.children[char], prefix + char, callback);
    }
  }
}
