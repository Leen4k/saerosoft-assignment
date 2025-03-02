import { ListNode, DoublyLinkedList } from "../utils/collections/collection";

export class LRUCache {
  private capacity: number;
  private cache: Map<string, ListNode<[string, string]>>;
  private list = new DoublyLinkedList<[string, string]>();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  put(key: string, value: string): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = [key, value];
      this.list.moveToHead(node);
      return;
    }

    const node = this.list.push([key, value]);
    this.cache.set(key, node);

    if (this.list.size() > this.capacity) {
      const items = this.list.getAllItems();
      const oldestItem = items[items.length - 1];
      this.cache.delete(oldestItem[0]);
      // Remove the oldest item by popping until we're at capacity
      while (this.list.size() > this.capacity) {
        this.list.pop();
      }
    }
  }

  get(key: string): string | null {
    if (!this.cache.has(key)) return null;
    const node = this.cache.get(key)!;
    this.list.moveToHead(node);
    return node.value[1];
  }

  size(): number {
    return this.list.size();
  }
}
