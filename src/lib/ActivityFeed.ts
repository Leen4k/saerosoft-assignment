import { DoublyLinkedList } from "../utils/collections/collection";

export class ActivityFeed {
  private list = new DoublyLinkedList<string>();

  addActivity(activity: string): void {
    this.list.push(activity);
  }

  deleteActivity(index: number): void {
    if (index >= this.list.size()) return;

    const activities = this.list.getAllItems();
    const newActivities: string[] = activities.filter((_, i) => i !== index);

    // Clear and rebuild the list
    while (!this.list.isEmpty()) {
      this.list.pop();
    }

    // Add activities back in reverse order to maintain the same order
    for (let i = newActivities.length - 1; i >= 0; i--) {
      this.list.push(newActivities[i]);
    }
  }

  showActivities(): string[] {
    return this.list.getAllItems();
  }
}
