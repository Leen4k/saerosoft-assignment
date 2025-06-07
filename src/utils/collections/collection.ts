// Base interface for all collections
export interface ICollection<T> {
  isEmpty(): boolean;
  size(): number;
  peek(): T | undefined | null;
  getAllItems(): T[];
}

// Base abstract class for array-based collections
export abstract class ArrayCollection<T> implements ICollection<T> {
  protected items: T[] = [];

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    return this.items[this.getPeekIndex()];
  }

  getAllItems(): T[] {
    return [...this.items];
  }

  protected abstract getPeekIndex(): number;
}

// Queue implementation (FIFO)
export class Queue<T> extends ArrayCollection<T> {
  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  protected getPeekIndex(): number {
    return 0;
  }
}

// Stack implementation (LIFO)
export class Stack<T> extends ArrayCollection<T> {
  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  protected getPeekIndex(): number {
    return this.items.length - 1;
  }
}

// Priority Queue implementation
export interface IPrioritized {
  priority: number;
}

export class PriorityQueue<T extends IPrioritized> extends Queue<T> {
  enqueue(item: T): void {
    const insertIndex = this.items.findIndex(
      (existing) => existing.priority > item.priority
    );

    if (insertIndex === -1) {
      this.items.push(item);
    } else {
      this.items.splice(insertIndex, 0, item);
    }
  }
}

// Node interface for linked structures
export interface IListNode<T> {
  value: T;
  prev: IListNode<T> | null;
  next: IListNode<T> | null;
}

// Node implementation
export class ListNode<T> implements IListNode<T> {
  value: T;
  prev: ListNode<T> | null = null;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

// Base LinkedList implementation
export abstract class BaseLinkedList<T> implements ICollection<T> {
  protected head: ListNode<T> | null = null;
  protected tail: ListNode<T> | null = null;
  protected _size = 0;

  isEmpty(): boolean {
    return this._size === 0;
  }

  size(): number {
    return this._size;
  }

  peek(): T | null {
    return this.head ? this.head.value : null;
  }

  getAllItems(): T[] {
    const items: T[] = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return items;
  }

  protected addToHead(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this._size++;
    return node;
  }

  protected removeNode(node: ListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
    this._size--;
  }

  push(value: T): ListNode<T> {
    if (!this.tail) {
      return this.addToHead(value);
    }
    const node = new ListNode(value);
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
    this._size++;
    return node;
  }

  pop(): T | null {
    if (!this.head) return null;
    const value = this.head.value;
    this.removeNode(this.head);
    return value;
  }
}

// Doubly LinkedList implementation
export class DoublyLinkedList<T> extends BaseLinkedList<T> {
  moveToHead(node: ListNode<T>): void {
    if (node === this.head) return;
    this.removeNode(node);
    this.addToHead(node.value);
  }
}

// Circular LinkedList implementation
export class CircularLinkedList<T> extends BaseLinkedList<T> {
  protected override addToHead(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this.head) {
      node.next = node;
      node.prev = node;
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      node.prev = this.tail;
      this.tail!.next = node;
      this.head.prev = node;
      this.head = node;
    }
    this._size++;
    return node;
  }

  override push(value: T): ListNode<T> {
    if (!this.tail) {
      return this.addToHead(value);
    }
    const node = new ListNode(value);
    node.prev = this.tail;
    node.next = this.head;
    this.tail.next = node;
    this.head!.prev = node;
    this.tail = node;
    this._size++;
    return node;
  }
}

// Base Map Collection for key-value storage
export abstract class MapCollection<K, V> implements ICollection<[K, V]> {
  protected map: Map<K, V>;

  constructor() {
    this.map = new Map<K, V>();
  }

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  isEmpty(): boolean {
    return this.map.size === 0;
  }

  size(): number {
    return this.map.size;
  }

  peek(): [K, V] | undefined {
    const firstEntry = this.map.entries().next().value;
    return firstEntry ? [firstEntry[0], firstEntry[1]] : undefined;
  }

  getAllItems(): [K, V][] {
    return Array.from(this.map.entries());
  }

  getKeys(): K[] {
    return Array.from(this.map.keys());
  }

  getValues(): V[] {
    return Array.from(this.map.values());
  }
}

// Hash Map Collection with collision handling
export class HashMapCollection<V> extends MapCollection<string, V> {
  private collisionCounter: Map<string, number>;
  private readonly PRIME1: number = 31;
  private readonly PRIME2: number = 1000000007;

  constructor() {
    super();
    this.collisionCounter = new Map<string, number>();
  }

  protected generateHash(input: string, base: number = 36): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash * this.PRIME1 + input.charCodeAt(i)) % this.PRIME2;
    }
    return hash.toString(base);
  }

  protected handleCollision(baseHash: string): string {
    const counter = (this.collisionCounter.get(baseHash) || 0) + 1;
    this.collisionCounter.set(baseHash, counter);
    return `${baseHash}${counter}`;
  }

  setWithHash(value: V, hashInput: string): string {
    let hash = this.generateHash(hashInput);

    // Handle collisions
    while (this.has(hash) && this.get(hash) !== value) {
      hash = this.handleCollision(hash);
    }

    this.set(hash, value);
    return hash;
  }

  override clear(): void {
    super.clear();
    this.collisionCounter.clear();
  }
}

// Integrity Map Collection for file/data integrity
export class IntegrityMapCollection extends MapCollection<string, string> {
  private static readonly PRIME1: number = 31;
  private static readonly PRIME2: number = 1000000007;
  private static readonly PRIME3: number = 16777619;

  generateHash(input: string, base: number = 36): string {
    let hash1 = 0;
    let hash2 = 2166136261;

    for (let i = 0; i < input.length; i++) {
      hash1 =
        (hash1 * IntegrityMapCollection.PRIME1 + input.charCodeAt(i)) %
        IntegrityMapCollection.PRIME2;
      hash2 = hash2 ^ input.charCodeAt(i);
      hash2 = (hash2 * IntegrityMapCollection.PRIME3) >>> 0;
    }

    const combinedHash = (hash1 + hash2) % IntegrityMapCollection.PRIME2;
    const finalHash =
      (combinedHash + IntegrityMapCollection.PRIME2) %
        IntegrityMapCollection.PRIME2 >>>
      0;

    return finalHash.toString(base);
  }

  setWithIntegrity(key: string, value: string): void {
    const hash = this.generateHash(value);
    this.set(key, hash);
  }

  verifyIntegrity(key: string, value: string): boolean {
    const storedHash = this.get(key);
    if (!storedHash) return false;

    const currentHash = this.generateHash(value);
    return currentHash === storedHash;
  }
}
