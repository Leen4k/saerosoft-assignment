import { LinkedList } from "./LinkedList";

export interface ListNode<T> {
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;
}

export class DoublyLinkedList<T> extends LinkedList<T> {
  moveToHead(node: ListNode<T>): void {
    if (node === this.head) return;
    this.removeNode(node);
    this.addToHead(node.value);
  }
}
