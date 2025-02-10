import { ListNode } from '../types';

export class LRUCache {
  private capacity: number;
  private cache: Map<string, ListNode<[string, string]>>;
  private head: ListNode<[string, string]> | null = null;
  private tail: ListNode<[string, string]> | null = null;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  private moveToFront(node: ListNode<[string, string]>): void {
    if (node === this.head) return;
    
    const prev = node.prev;
    const next = node.next;
    
    if (prev) prev.next = next;
    if (next) next.prev = prev;
    if (node === this.tail) this.tail = prev;
    
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
  }

  put(key: string, value: string): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = [key, value];
      this.moveToFront(node);
      return;
    }

    const node: ListNode<[string, string]> = {
      value: [key, value],
      prev: null,
      next: this.head
    };

    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;

    this.cache.set(key, node);

    if (this.cache.size > this.capacity && this.tail) {
      this.cache.delete(this.tail.value[0]);
      this.tail = this.tail.prev;
      if (this.tail) this.tail.next = null;
    }
  }

  get(key: string): string | null {
    const node = this.cache.get(key);
    if (!node) return null;
    this.moveToFront(node);
    return node.value[1];
  }

  size(): number {
    return this.cache.size;
  }
} 