import { DoublyLinkedList } from "../utils/linklist/LinkList";

export class ActivityFeed {
  private list = new DoublyLinkedList<string>();

  addActivity(activity: string): void {
    this.list.addToHead(activity);
  }

  deleteActivity(index: number): void {
    if (index >= this.list.getSize()) return;
    let current = this.list.head;
    for (let i = 0; i < index && current; i++) {
      current = current.next;
    }
    if (current) this.list.removeNode(current);
  }

  showActivities(): string[] {
    const activities: string[] = [];
    let current = this.list.head;
    while (current) {
      activities.push(current.value);
      current = current.next;
    }
    return activities;
  }
}
