import React, { useState, useCallback, useMemo } from "react";
import FileIntegrityManager from "./FileIntegrityManager";

const FileIntegrityCheck: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<string>("");
  const [storedHash, setStoredHash] = useState<string>("");

  const fileIntegrityManager = useMemo(() => new FileIntegrityManager(), []);

  const handleStoreHash = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (fileName && fileContent) {
        fileIntegrityManager.storeFileHash(fileName, fileContent);
        const hash = fileIntegrityManager.getStoredHash(fileName);
        setStoredHash(hash || "");
        setVerificationResult("Hash stored");
      }
    },
    [fileName, fileContent, fileIntegrityManager]
  );

  const handleVerifyIntegrity = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (fileName && fileContent) {
        const result = fileIntegrityManager.verifyFileIntegrity(
          fileName,
          fileContent
        );
        setVerificationResult(result);
      }
    },
    [fileName, fileContent, fileIntegrityManager]
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Integrity Check</h1>

      <div className="space-y-6">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="fileName"
              className="block text-sm font-medium mb-1"
            >
              File Name
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter file name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fileContent"
              className="block text-sm font-medium mb-1"
            >
              File Content
            </label>
            <textarea
              id="fileContent"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Enter file content"
              required
            />
          </div>

          <div className="space-x-4">
            <button
              onClick={handleStoreHash}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Store Hash
            </button>
            <button
              onClick={handleVerifyIntegrity}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Verify Integrity
            </button>
          </div>
        </form>

        {verificationResult && (
          <div
            className={`p-4 rounded ${
              verificationResult === "File is intact"
                ? "bg-green-100"
                : verificationResult === "File has been modified"
                ? "bg-red-100"
                : "bg-blue-100"
            }`}
          >
            <p className="font-medium">{verificationResult}</p>
            {storedHash && (
              <p className="mt-2 font-mono text-sm">
                Stored Hash: {storedHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileIntegrityCheck;
