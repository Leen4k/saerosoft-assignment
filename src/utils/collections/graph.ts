import { ICollection, Queue } from "./collection";

export interface GraphNode<T> {
  value: T;
  id: string;
}

export class DirectedGraph<T> implements ICollection<GraphNode<T>> {
  private adjacencyList: Map<string, Set<string>>;
  private nodes: Map<string, GraphNode<T>>;
  private inDegrees: Map<string, number>;

  constructor() {
    this.adjacencyList = new Map();
    this.nodes = new Map();
    this.inDegrees = new Map();
  }

  addNode(id: string, value: T): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, value });
      this.adjacencyList.set(id, new Set());
      this.inDegrees.set(id, 0);
    }
  }

  addEdge(fromId: string, toId: string): void {
    if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
      throw new Error(
        `Nodes with IDs ${fromId} or ${toId} don't exist in the graph`
      );
    }

    const edges = this.adjacencyList.get(fromId);
    if (edges && !edges.has(toId)) {
      edges.add(toId);
      const currentInDegree = this.inDegrees.get(toId) || 0;
      this.inDegrees.set(toId, currentInDegree + 1);
    }
  }

  removeEdge(fromId: string, toId: string): void {
    const edges = this.adjacencyList.get(fromId);
    if (edges && edges.has(toId)) {
      edges.delete(toId);
      const currentInDegree = this.inDegrees.get(toId) || 0;
      this.inDegrees.set(toId, currentInDegree - 1);
    }
  }

  getNode(id: string): GraphNode<T> | undefined {
    return this.nodes.get(id);
  }

  getNeighbors(id: string): string[] {
    const edges = this.adjacencyList.get(id);
    return edges ? Array.from(edges) : [];
  }

  getAllNodes(): GraphNode<T>[] {
    return Array.from(this.nodes.values());
  }

  getInDegree(id: string): number {
    return this.inDegrees.get(id) || 0;
  }

  hasCycle(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleUtil = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = this.getNeighbors(nodeId);
      for (const neighbor of neighbors) {
        if (hasCycleUtil(neighbor)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (hasCycleUtil(nodeId)) return true;
      }
    }

    return false;
  }

  topologicalSort(): string[] | null {
    if (this.hasCycle()) return null;

    const result: string[] = [];
    const inDegreesCopy = new Map(this.inDegrees);
    const queue = new Queue<string>();

    for (const [nodeId, inDegree] of inDegreesCopy.entries()) {
      if (inDegree === 0) {
        queue.enqueue(nodeId);
      }
    }

    while (!queue.isEmpty()) {
      const nodeId = queue.dequeue()!;
      result.push(nodeId);

      const neighbors = this.getNeighbors(nodeId);
      for (const neighbor of neighbors) {
        const newInDegree = inDegreesCopy.get(neighbor)! - 1;
        inDegreesCopy.set(neighbor, newInDegree);

        if (newInDegree === 0) {
          queue.enqueue(neighbor);
        }
      }
    }

    return result.length === this.nodes.size ? result : null;
  }

  isEmpty(): boolean {
    return this.nodes.size === 0;
  }

  size(): number {
    return this.nodes.size;
  }

  peek(): GraphNode<T> | undefined {
    const firstNode = this.nodes.values().next().value;
    return firstNode;
  }

  getAllItems(): GraphNode<T>[] {
    return this.getAllNodes();
  }
}
