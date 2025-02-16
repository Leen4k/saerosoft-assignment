import { CircularLinkedList } from "../utils/CircularLinkedList";
import { ListNode } from "../utils/LinkedList";

export class ImageCarousel {
  private list = new CircularLinkedList<string>();
  private current: ListNode<string> | null = null;

  addImage(url: string): void {
    const node = this.list.addToHead(url);
    if (!this.current) {
      this.current = node;
    }
  }

  nextImage(): string {
    if (!this.current) return "";
    this.current = this.current.next!;
    return this.current.value;
  }

  prevImage(): string {
    if (!this.current) return "";
    this.current = this.current.prev!;
    return this.current.value;
  }

  getCurrentImage(): string | null {
    return this.current?.value ?? null;
  }
}
