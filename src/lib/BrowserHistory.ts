import { DoublyLinkedList } from "../utils/LinkList";
import { ListNode } from "../utils/LinkedList";

export class BrowserHistory {
  private list = new DoublyLinkedList<string>();
  private current: ListNode<string> | null = null;

  visitPage(url: string): void {
    this.current = this.list.addToHead(url);
  }

  goBack(): string | null {
    if (!this.current?.prev) return null;
    this.current = this.current.prev;
    return this.current.value;
  }

  goForward(): string | null {
    if (!this.current?.next) return null;
    this.current = this.current.next;
    return this.current.value;
  }

  getCurrentPage(): string | null {
    return this.current?.value ?? null;
  }
}
