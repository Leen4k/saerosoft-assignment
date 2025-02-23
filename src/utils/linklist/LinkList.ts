// linked-list.ts
export interface IListNode<T> {
  value: T;
  prev: IListNode<T> | null;
  next: IListNode<T> | null;
}

export class ListNode<T> implements IListNode<T> {
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export abstract class BaseLinkedList<T> {
  public head: ListNode<T> | null = null;
  public tail: ListNode<T> | null = null;
  public size = 0;

  addToHead(value: T): ListNode<T> {
    const node = new ListNode(value);
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size++;
    return node;
  }

  public removeNode(node: ListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
    this.size--;
  }

  peek(): T | null {
    return this.head ? this.head.value : null;
  }

  pop(): T | null {
    if (!this.head) return null;
    const value = this.head.value;
    this.removeNode(this.head);
    return value;
  }

  push(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this.tail) {
      return this.addToHead(value);
    }
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
    this.size++;
    return node;
  }

  getSize(): number {
    return this.size;
  }
}

export class DoublyLinkedList<T> extends BaseLinkedList<T> {
  moveToHead(node: ListNode<T>): void {
    if (node === this.head) return;
    this.removeNode(node);
    this.addToHead(node.value);
  }
}

export class CircularLinkedList<T> extends BaseLinkedList<T> {
  addToHead(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this.head) {
      node.next = node;
      node.prev = node;
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      node.prev = this.tail;
      this.tail!.next = node;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
    return node;
  }

  push(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this.tail) {
      return this.addToHead(value);
    }
    node.prev = this.tail;
    node.next = this.head;
    this.tail.next = node;
    this.head!.prev = node;
    this.tail = node;
    this.size++;
    return node;
  }
}
