export class ListNode<T> {
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  size = 0;

  addToHead(value: T): ListNode<T> {
    const node: ListNode<T> = new ListNode(value);
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size++;
    return node;
  }

  removeNode(node: ListNode<T>): void {
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
    const node: ListNode<T> = new ListNode(value);
    if (!this.tail) {
      this.addToHead(value);
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
      this.size++;
    }
    return node;
  }
}
