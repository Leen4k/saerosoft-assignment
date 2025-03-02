import React, { useState, useEffect, useRef, useCallback } from "react";
import { PriorityQueue } from "../../utils/collections/collection";

interface DownloadItem {
  fileName: string;
  priority: number;
  downloadTime: number;
  startTime?: number;
  isDownloading?: boolean;
}

const DownloadManager = () => {
  const [downloadQueue] = useState(new PriorityQueue<DownloadItem>());
  const [activeDownloads, setActiveDownloads] = useState<DownloadItem[]>([]);
  const [completedDownloads, setCompletedDownloads] = useState<DownloadItem[]>(
    []
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [formData, setFormData] = useState({
    fileName: "",
    priority: 1,
    downloadTime: 1,
  });

  const intervalRef = useRef<number | null>(null);

  const getCurrentTime = (): number => {
    return currentTime;
  };

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${getCurrentTime().toFixed(1)}s] ${message}`,
    ]);
  };

  const enqueueDownload = (
    fileName: string,
    priority: number,
    downloadTime: number
  ): void => {
    downloadQueue.enqueue({
      fileName,
      priority,
      downloadTime,
      isDownloading: false,
      startTime: undefined,
    });
    addLog(`Added to queue: ${fileName} (priority ${priority})`);
  };

  const checkQueue = useCallback(() => {
    const now = getCurrentTime();
    const updatedActive = [...activeDownloads];
    const newCompleted: DownloadItem[] = [];

    for (let i = updatedActive.length - 1; i >= 0; i--) {
      const download = updatedActive[i];
      if (
        download.startTime !== undefined &&
        now >= download.startTime + download.downloadTime
      ) {
        const completed = updatedActive.splice(i, 1)[0];
        newCompleted.push(completed);
        addLog(`Download completed: ${completed.fileName}`);
      }
    }

    if (newCompleted.length > 0) {
      setCompletedDownloads((prev) => [...prev, ...newCompleted]);
    }

    while (updatedActive.length < 3 && !downloadQueue.isEmpty()) {
      const nextDownload = downloadQueue.dequeue();
      if (nextDownload) {
        nextDownload.startTime = now;
        nextDownload.isDownloading = true;
        updatedActive.push(nextDownload);
        addLog(
          `Download started: ${nextDownload.fileName} (priority ${nextDownload.priority})`
        );
      }
    }

    setActiveDownloads(updatedActive);
  }, [activeDownloads, downloadQueue]);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 0.1;
        return Number(newTime.toFixed(1));
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    checkQueue();
  }, [currentTime, checkQueue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enqueueDownload(
      formData.fileName,
      formData.priority,
      formData.downloadTime
    );
    setFormData({
      fileName: "",
      priority: 1,
      downloadTime: 1,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Priority Download Manager</h2>

        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Name
            </label>
            <input
              type="text"
              value={formData.fileName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fileName: e.target.value }))
              }
              placeholder="e.g. document.pdf"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: Number(e.target.value),
                  }))
                }
                placeholder="Higher = more important"
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Download Time (seconds)
              </label>
              <input
                type="number"
                value={formData.downloadTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    downloadTime: Number(e.target.value),
                  }))
                }
                placeholder="Duration in seconds"
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !formData.fileName || !formData.priority || !formData.downloadTime
            }
          >
            Add Download
          </button>
        </form>

        <div className="mb-4">
          <h3 className="font-bold mb-2">
            Active Downloads ({activeDownloads.length}/3):
          </h3>
          <div className="space-y-2">
            {activeDownloads.map((download, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                <div>
                  {download.fileName} (Priority: {download.priority})
                </div>
                <div className="text-sm text-gray-600">
                  Progress:{" "}
                  {Math.min(
                    100,
                    Math.floor(
                      ((getCurrentTime() - (download.startTime || 0)) /
                        download.downloadTime) *
                        100
                    )
                  )}
                  %
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">
            Completed Downloads ({completedDownloads.length}):
          </h3>
          <div className="space-y-2">
            {completedDownloads.map((download, index) => (
              <div key={index} className="p-2 bg-green-100 rounded">
                {download.fileName} (Priority: {download.priority})
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Download Queue:</h3>
          <div className="space-y-2">
            {downloadQueue
              .getAllItems()
              .map((download: DownloadItem, index: number) => (
                <div key={index} className="p-2 bg-yellow-100 rounded">
                  {download.fileName} (Priority: {download.priority})
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Download Logs:</h3>
          <div className="bg-gray-100 p-2 rounded h-48 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;
