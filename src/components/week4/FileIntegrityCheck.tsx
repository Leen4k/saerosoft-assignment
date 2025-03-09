import React, { useState, useCallback, useMemo } from "react";
import FileIntegrityManager from "./FileIntegrityManager";

const FileIntegrityCheck: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [hashValue, setHashValue] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<string>("");
  const [calculatedHash, setCalculatedHash] = useState<string>("");

  const fileIntegrityManager = useMemo(() => new FileIntegrityManager(), []);

  const handleCalculateHash = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (fileContent) {
        const hash = fileIntegrityManager.calculateHash(fileContent);
        setCalculatedHash(hash);
      }
    },
    [fileContent, fileIntegrityManager]
  );

  const handleVerifyIntegrity = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (fileName && fileContent && hashValue) {
        const calculatedHash = fileIntegrityManager.calculateHash(fileContent);
        setCalculatedHash(calculatedHash);
        const isIntact = calculatedHash === hashValue;
        setVerificationResult(
          isIntact ? "File is intact" : "File has been modified"
        );
      }
    },
    [fileName, fileContent, hashValue, fileIntegrityManager]
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

          <div className="flex space-x-4">
            <button
              onClick={handleCalculateHash}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              type="button"
            >
              Calculate Hash
            </button>
          </div>

          {calculatedHash && (
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-sm font-medium">Calculated Hash:</p>
              <p className="font-mono text-sm break-all">{calculatedHash}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="hashValue"
              className="block text-sm font-medium mb-1"
            >
              Hash Value to Verify Against
            </label>
            <input
              id="hashValue"
              type="text"
              value={hashValue}
              onChange={(e) => setHashValue(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter hash value to verify against"
              required
            />
          </div>

          <div>
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
                : "bg-red-100"
            }`}
          >
            <p className="font-medium">{verificationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileIntegrityCheck;
