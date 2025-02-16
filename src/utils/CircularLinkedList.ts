import { LinkedList, ListNode } from "./LinkedList";

export class CircularLinkedList<T> extends LinkedList<T> {
  addToHead(value: T): ListNode<T> {
    const node: ListNode<T> = new ListNode(value);
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
      node.next = this.head;
      this.tail!.next = node;
      this.head!.prev = node;
      this.tail = node;
      this.size++;
    }
    return node;
  }
}
