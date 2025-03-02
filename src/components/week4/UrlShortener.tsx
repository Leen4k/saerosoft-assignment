import React, { useState } from "react";
import UrlShortenerMap from "./UrlShortenerMap";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [lookupUrl, setLookupUrl] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const urlShortener = React.useMemo(() => new UrlShortenerMap(), []);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (longUrl) {
      const shortened = urlShortener.generateShortURL(longUrl);
      setShortUrl(shortened);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupUrl) {
      const original = urlShortener.getOriginalURL(lookupUrl);
      setOriginalUrl(original);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shorten URL</h2>
        <form onSubmit={handleShorten} className="space-y-4">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Shorten URL
          </button>
        </form>
        {shortUrl && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p>
              Short URL: <span className="font-mono">{shortUrl}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Look Up Original URL</h2>
        <form onSubmit={handleLookup} className="space-y-4">
          <input
            type="text"
            value={lookupUrl}
            onChange={(e) => setLookupUrl(e.target.value)}
            placeholder="Enter short URL"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Look Up URL
          </button>
        </form>
        {originalUrl !== null && (
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <p>
              Original URL:{" "}
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 break-all"
              >
                {originalUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
