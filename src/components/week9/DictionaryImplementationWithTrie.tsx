//##problem statement
//so how does tries stores word efficiently?
//Trie is a tree-like data-structure used for storing words and it is
// effcient for:
// - insertion (O(L), where l = wordlength)
// - search word (O(L))
// - Auto completion (finding word with the given prefix)

//my solution to solve this problem are:
// -first I need to define the Trie and TrieNode
// -implement the given function such as insertWord, searchWord and autoComplete functions
// ====for UI======
// display search result dynamically as the user typing

//implementation of the trie in data structure
// first task is to implemet TrieNode to store
// -a map of children ({[key: string]: TrieNode})
// -boolean isEndOfWord

// second task is to implement Trie with
// root empty TrieNode

class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }
}

function insertWord(trie: Trie, word: string): void {
  let node = trie.root;

  for (const char of word) {
    if (!node.children[char]) node.children[char] = new TrieNode();
    node = node.children[char];
  }

  node.isEndOfWord = true;
}

function searchWord(trie: Trie, word: string): boolean {
  let node = trie.root;

  for (const char of word) {
    !node.children[char] && false;
    node = node.children[char];
  }

  return node.isEndOfWord;
}

function autoComplete(trie: Trie, prefix: string): string[] {
  let node = trie.root;

  for (const char of prefix) {
    !node?.children[char] && [];
    node = node?.children[char];
  }

  return collectWords(node, prefix);
}

function collectWords(node: TrieNode, prefix: string): string[] {
  let results: string[] = [];
  node?.isEndOfWord && results.push(prefix);

  for (const char in node?.children) {
    results.push(...collectWords(node.children[char], prefix + char));
  }
  return results;
}

const DictionaryImplementationWithTrie = () => {
  const trie = new Trie();
  insertWord(trie, "app");
  insertWord(trie, "apple");
  insertWord(trie, "aprilla");

  //search word
  console.log(searchWord(trie, "apple"));
  console.log(autoComplete(trie, "hello world"));
  return <div>DictionaryImplementationWithTrie</div>;
};

export default DictionaryImplementationWithTrie;
