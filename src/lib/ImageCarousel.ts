import { ListNode } from '../types';

export class ImageCarousel {
  private current: ListNode<string> | null = null;
  private size = 0;

  addImage(url: string): void {
    const node: ListNode<string> = { value: url, prev: null, next: null };
    if (!this.current) {
      node.next = node;
      node.prev = node;
      this.current = node;
    } else {
      node.next = this.current;
      node.prev = this.current.prev;
      this.current.prev!.next = node;
      this.current.prev = node;
    }
    this.size++;
  }

  nextImage(): string {
    if (!this.current) return '';
    this.current = this.current.next!;
    return this.current.value;
  }

  prevImage(): string {
    if (!this.current) return '';
    this.current = this.current.prev!;
    return this.current.value;
  }

  getCurrentImage(): string | null {
    return this.current?.value ?? null;
  }
} 