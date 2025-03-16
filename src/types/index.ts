export interface ListNode<T> {
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;
}

export interface TreeNode<T> {
  children: TreeNode<T>[];
  parent: TreeNode<T> | null;
  data: T;
}
