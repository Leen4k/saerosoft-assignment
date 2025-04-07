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

import { useState, useEffect, useRef } from "react";
import { Trie } from "../../utils/collections/trie";


const DictionaryImplementationWithTrie = () => {
  const [trie] = useState<Trie>(() => new Trie());
  const [inputWord, setInputWord] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [wordExists, setWordExists] = useState<boolean | null>(null);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialWords = [
      "apple",
      "application",
      "banana",
      "book",
      "cat",
      "code",
      "computer",
      "data",
      "dog",
      "elephant",
      "function",
      "game",
      "hello",
      "house",
      "javascript",
      "knowledge",
      "language",
      "learn",
      "program",
      "react",
      "structure",
      "tree",
      "trie",
      "typescript",
      "world",
      "girl friend",
      "boy friend",
      "girl",
      "boy",
      "friend",
      "friends",
      "friends",
    ];

    initialWords.forEach((word) => {
      trie.insert(word);
      setDictionary((prev) => [...prev, word]);
    });
  }, [trie]);

  useEffect(() => {
    if (searchQuery) {
      const results = trie.findWordsWithPrefix(searchQuery);
      setSuggestions(results);
      setWordExists(trie.search(searchQuery));
    } else {
      setSuggestions([]);
      setWordExists(null);
    }
  }, [searchQuery, trie]);

  const handleAddWord = () => {
    if (inputWord.trim() && !trie.search(inputWord.trim())) {
      trie.insert(inputWord.trim());
      setDictionary((prev) => [...prev, inputWord.trim()].sort());
      setInputWord("");

      if (searchQuery && inputWord.startsWith(searchQuery)) {
        setSuggestions((prev) => [...prev, inputWord].sort());
      }
    }
  };

  const handleSelectSuggestion = (word: string) => {
    setSearchQuery(word);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        Dictionary Implementation Using Trie
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Add Word to Dictionary</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value.toLowerCase())}
            placeholder="Enter a word to add"
            className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
          />
          <button
            onClick={handleAddWord}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Word
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Search Dictionary</h2>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          placeholder="Start typing to search"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {searchQuery && (
          <div className="mt-2">
            {wordExists !== null && (
              <p
                className={`text-sm ${
                  wordExists ? "text-green-600" : "text-red-600"
                }`}
              >
                "{searchQuery}" {wordExists ? "exists" : "does not exist"} in
                the dictionary.
              </p>
            )}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-3">
            <h3 className="text-md font-medium mb-2">Suggestions:</h3>
            <div className="max-h-60 overflow-y-auto">
              <ul className="border border-gray-200 rounded divide-y divide-gray-200">
                {suggestions.map((word, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSuggestion(word)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Dictionary Contents</h2>
        <div className="border border-gray-200 rounded p-4 max-h-60 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-2">
            Total words: {dictionary.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {dictionary.map((word, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryImplementationWithTrie;
