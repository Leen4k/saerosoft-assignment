import { ListNode, DoublyLinkedList } from "../utils/collections/collection";

export class BrowserHistory {
  private list = new DoublyLinkedList<string>();
  private current: ListNode<string> | null = null;

  visitPage(url: string): void {
    this.current = this.list.push(url);
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
