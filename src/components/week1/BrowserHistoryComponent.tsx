import { useState } from "react";
import { BrowserHistory } from "../../lib/BrowserHistory";

export const BrowserHistoryComponent = () => {
  const [history] = useState(() => new BrowserHistory());
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  const visitPage = () => {
    const url = `Page ${Math.floor(Math.random() * 100)}`;
    history.visitPage(url);
    setCurrentPage(history.getCurrentPage());
  };

  const goBack = () => {
    setCurrentPage(history.goBack());
  };

  const goForward = () => {
    setCurrentPage(history.goForward());
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Browser History</h2>
      <div className="mb-4">
        <p className="text-gray-600">Current Page:</p>
        <p className="font-medium">{currentPage || "No page visited"}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={visitPage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Visit New Page
        </button>
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={goForward}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Forward
        </button>
      </div>
    </div>
  );
};
