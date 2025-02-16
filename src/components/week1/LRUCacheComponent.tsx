import { useState } from "react";
import { LRUCache } from "../../lib/LRUCache";

export const LRUCacheComponent = () => {
  const [cache] = useState(() => new LRUCache(3));
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handlePut = () => {
    if (key && value) {
      cache.put(key, value);
      setKey("");
      setValue("");
      setResult(`Added: ${key} -> ${value}`);
    }
  };

  const handleGet = () => {
    if (key) {
      const value = cache.get(key);
      setResult(value ? `Found: ${value}` : "Not found");
      setKey("");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">LRU Cache</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key"
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePut}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Put
        </button>
        <button
          onClick={handleGet}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Get
        </button>
      </div>
      {result && <p className="text-gray-600">{result}</p>}
    </div>
  );
};
