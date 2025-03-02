import { IntegrityMapCollection } from "../../utils/collections/collection";

class FileIntegrityManager {
  private fileHashes: IntegrityMapCollection;

  constructor() {
    this.fileHashes = new IntegrityMapCollection();
  }

  generateFileHash(fileContent: string): string {
    return this.fileHashes.generateHash(fileContent);
  }

  storeFileHash(fileName: string, fileContent: string): void {
    this.fileHashes.setWithIntegrity(fileName, fileContent);
  }

  verifyFileIntegrity(fileName: string, fileContent: string): string {
    if (!this.fileHashes.has(fileName)) {
      return "No hash found in this file";
    }

    return this.fileHashes.verifyIntegrity(fileName, fileContent)
      ? "File is the same"
      : "File changes";
  }

  getStoredHash(fileName: string): string | undefined {
    return this.fileHashes.get(fileName);
  }

  clear(): void {
    this.fileHashes.clear();
  }
}

export default FileIntegrityManager;
