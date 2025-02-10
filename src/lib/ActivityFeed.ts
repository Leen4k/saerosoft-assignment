import { ListNode } from '../types';

export class ActivityFeed {
  private head: ListNode<string> | null = null;
  private size = 0;

  addActivity(activity: string): void {
    const node: ListNode<string> = { value: activity, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    this.head = node;
    this.size++;
  }

  deleteActivity(index: number): void {
    if (index >= this.size) return;
    
    let current = this.head;
    for (let i = 0; i < index && current; i++) {
      current = current.next;
    }
    
    if (!current) return;
    
    if (current.prev) current.prev.next = current.next;
    if (current.next) current.next.prev = current.prev;
    if (current === this.head) this.head = current.next;
    this.size--;
  }

  showActivities(): string[] {
    const activities: string[] = [];
    let current = this.head;
    while (current) {
      activities.push(current.value);
      current = current.next;
    }
    return activities;
  }
} 