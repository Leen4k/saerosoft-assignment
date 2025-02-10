import { ListNode } from '../types';

export class BrowserHistory {
  private current: ListNode<string> | null = null;

  visitPage(url: string): void {
    const node: ListNode<string> = { value: url, prev: this.current, next: null };
    if (this.current) this.current.next = node;
    this.current = node;
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