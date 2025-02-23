import { Queue } from "./Queue";

export interface DownloadItem {
  fileName: string;
  priority: number;
  downloadTime: number;
  startTime?: number;
  isDownloading?: boolean;
}

export class PriorityQueue extends Queue<DownloadItem> {
  enqueue(item: DownloadItem): void {
    const items = this.getAllItems();

    const insertIndex = items.findIndex(
      (existing) => existing.priority < item.priority
    );

    if (insertIndex === -1) {
      items.push(item);
    } else {
      items.splice(insertIndex, 0, item);
    }

    this.items = items;
  }
}
