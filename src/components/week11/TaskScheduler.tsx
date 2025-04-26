import React, { useState, useEffect, useRef } from "react";
import { DirectedGraph } from "../../utils/collections/graph";

export interface Task {
  id: string;
  name: string;
  description: string;
}

export interface TaskNode {
  task: Task;
  dependencies: TaskNode[];
}

export interface TaskGraph {
  nodes: { [key: string]: TaskNode };
}

function buildTaskGraph(
  tasks: Task[],
  dependencies: Array<[string, string]>
): TaskGraph {
  const graph = new DirectedGraph<Task>();

  for (const task of tasks) {
    graph.addNode(task.id, task);
  }

  for (const [taskId, dependsOnTaskId] of dependencies) {
    graph.addEdge(dependsOnTaskId, taskId);
  }

  const result: TaskGraph = { nodes: {} };
  for (const task of tasks) {
    const taskDependencies: TaskNode[] = [];

    for (const [taskId, dependsOnTaskId] of dependencies) {
      if (taskId === task.id) {
        const dependencyTask = tasks.find((t) => t.id === dependsOnTaskId);
        if (dependencyTask) {
          taskDependencies.push({
            task: dependencyTask,
            dependencies: [],
          });
        }
      }
    }

    result.nodes[task.id] = {
      task,
      dependencies: taskDependencies,
    };
  }

  for (const nodeId in result.nodes) {
    for (let i = 0; i < result.nodes[nodeId].dependencies.length; i++) {
      const depId = result.nodes[nodeId].dependencies[i].task.id;
      if (result.nodes[depId]) {
        result.nodes[nodeId].dependencies[i].dependencies = [
          ...result.nodes[depId].dependencies,
        ];
      }
    }
  }

  return result;
}

function findExecutionOrder(graph: TaskGraph): string[] | null {
  const directedGraph = new DirectedGraph<Task>();

  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    directedGraph.addNode(node.task.id, node.task);
  }

  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    for (const dep of node.dependencies) {
      directedGraph.addEdge(dep.task.id, nodeId);
    }
  }

  return directedGraph.topologicalSort();
}

function hasCycle(graph: TaskGraph): boolean {
  const directedGraph = new DirectedGraph<Task>();

  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    directedGraph.addNode(node.task.id, node.task);
  }

  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    for (const dep of node.dependencies) {
      directedGraph.addEdge(dep.task.id, nodeId);
    }
  }

  return directedGraph.hasCycle();
}

function getTasksByIds(graph: TaskGraph, ids: string[]): Task[] {
  return ids
    .map((id) => graph.nodes[id]?.task)
    .filter((task): task is Task => task !== undefined);
}

const initialTasks: Task[] = [
  {
    id: "task1",
    name: "Clean the House",
    description: "General cleaning of the house",
  },
  {
    id: "task2",
    name: "Do the Laundry",
    description: "Wash and fold clothes",
  },
  {
    id: "task3",
    name: "Wash Dishes",
    description: "Clean all dirty dishes",
  },
  { id: "task4", name: "Grocery Shopping", description: "Buy groceries" },
  {
    id: "task5",
    name: "Take Out Trash",
    description: "Dispose of all trash",
  },
  {
    id: "task6",
    name: "Mop Floors",
    description: "Mop all floors in the house",
  },
  {
    id: "task7",
    name: "Go play guitar",
    description: "Play guitar for 30 minutes",
  },
];

const initialDependencies: Array<[string, string]> = [
  ["task2", "task1"],
  ["task3", "task2"],
  ["task4", "task1"],
  ["task5", "task3"],
  ["task5", "task4"],
  ["task6", "task5"],
  ["task7", "task6"],
];

const TaskScheduler = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dependencies, setDependencies] =
    useState<Array<[string, string]>>(initialDependencies);
  const [graph, setGraph] = useState<TaskGraph | null>(null);
  const [executionOrder, setExecutionOrder] = useState<string[] | null>(null);
  const [hasCycleDetected, setHasCycleDetected] = useState<boolean>(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [fromTaskId, setFromTaskId] = useState("");
  const [toTaskId, setToTaskId] = useState("");
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tasks.length > 0) {
      const newGraph = buildTaskGraph(tasks, dependencies);
      setGraph(newGraph);
      const cycleDetected = hasCycle(newGraph);
      setHasCycleDetected(cycleDetected);
      const order = findExecutionOrder(newGraph);
      setExecutionOrder(order);
    }
  }, [tasks, dependencies]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim() === "") return;
    const newTaskId = `task${tasks.length + 1}`;
    const newTask: Task = {
      id: newTaskId,
      name: newTaskName,
      description: newTaskDescription || `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
    setNewTaskName("");
    setNewTaskDescription("");
  };

  const handleAddDependency = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromTaskId === toTaskId || !fromTaskId || !toTaskId) return;
    const dependencyExists = dependencies.some(
      ([from, to]) => from === fromTaskId && to === toTaskId
    );
    if (!dependencyExists) {
      const newDependencies: Array<[string, string]> = [
        ...dependencies,
        [fromTaskId, toTaskId],
      ];
      setDependencies(newDependencies);
    }
    setFromTaskId("");
    setToTaskId("");
  };

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    const updatedDependencies = dependencies.filter(
      ([from, to]) => from !== taskId && to !== taskId
    );
    setTasks(updatedTasks);
    setDependencies(updatedDependencies);
  };

  const handleRemoveDependency = (fromId: string, toId: string) => {
    const updatedDependencies = dependencies.filter(
      ([from, to]) => !(from === fromId && to === toId)
    );
    setDependencies(updatedDependencies);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Task Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <form onSubmit={handleAddTask} className="mb-4">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Task Name"
                className="w-full p-2 border rounded"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Task Description"
                className="w-full p-2 border rounded"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </form>
          <div className="overflow-y-auto max-h-60">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">{task.name}</div>
                  <div className="text-sm text-gray-600">
                    {task.description}
                  </div>
                  <div className="text-xs text-gray-500">ID: {task.id}</div>
                </div>
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Dependencies</h2>
          <form onSubmit={handleAddDependency} className="mb-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                className="p-2 border rounded"
                value={fromTaskId}
                onChange={(e) => setFromTaskId(e.target.value)}
              >
                <option value="">Task depends on...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={toTaskId}
                onChange={(e) => setToTaskId(e.target.value)}
              >
                <option value="">Prerequisite task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Dependency
            </button>
          </form>
          <div className="overflow-y-auto max-h-60">
            {dependencies.map(([fromId, toId], index) => {
              const fromTask = tasks.find((t) => t.id === fromId);
              const toTask = tasks.find((t) => t.id === toId);
              if (!fromTask || !toTask) return null;
              return (
                <div
                  key={`${fromId}-${toId}`}
                  className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{fromTask.name}</span>
                    <span className="mx-2 text-gray-500">depends on</span>
                    <span className="font-medium">{toTask.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveDependency(fromId, toId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Execution Order</h2>
        {hasCycleDetected ? (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <p className="font-bold">Cycle Detected!</p>
            <p>
              Cannot determine execution order. Please resolve circular
              dependencies.
            </p>
          </div>
        ) : executionOrder && executionOrder.length > 0 ? (
          <div className="bg-green-100 p-3 rounded mb-4">
            <p className="font-semibold mb-2">Valid execution order found:</p>
            <div className="flex flex-wrap gap-2">
              {executionOrder.map((taskId, index) => {
                const task = tasks.find((t) => t.id === taskId);
                return task ? (
                  <div
                    key={taskId}
                    className="bg-white border border-green-300 rounded p-2"
                  >
                    <span className="font-bold mr-2">{index + 1}:</span>
                    {task.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ) : (
          <p>Add tasks and dependencies to generate an execution order.</p>
        )}
      </div>
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Task Graph</h2>
        <div
          ref={graphContainerRef}
          className="border rounded p-4 min-h-[300px] relative"
        >
          {graph && tasks.length > 0 ? (
            <div className="flex flex-col items-center">
              <svg width="100%" height="300" className="bg-gray-50">
                {tasks.map((task, index) => {
                  const x = 100 + (index % 3) * 200;
                  const y = 60 + Math.floor(index / 3) * 100;
                  return (
                    <g key={task.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r={30}
                        fill={
                          hasCycleDetected
                            ? "#FCA5A5"
                            : executionOrder?.includes(task.id)
                            ? "#A7F3D0"
                            : "#E5E7EB"
                        }
                        stroke={hasCycleDetected ? "#EF4444" : "#10B981"}
                        strokeWidth={2}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {task.name.slice(0, 10)}
                      </text>
                      <text
                        x={x}
                        y={y + 45}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#4B5563"
                      >
                        {task.id}
                      </text>
                    </g>
                  );
                })}
                {dependencies.map(([fromId, toId], index) => {
                  const fromIndex = tasks.findIndex((t) => t.id === fromId);
                  const toIndex = tasks.findIndex((t) => t.id === toId);
                  if (fromIndex === -1 || toIndex === -1) return null;
                  const fromX = 100 + (fromIndex % 3) * 200;
                  const fromY = 60 + Math.floor(fromIndex / 3) * 100;
                  const toX = 100 + (toIndex % 3) * 200;
                  const toY = 60 + Math.floor(toIndex / 3) * 100;
                  const dx = toX - fromX;
                  const dy = toY - fromY;
                  const midX = (fromX + toX) / 2;
                  const midY = (fromY + toY) / 2;
                  const offsetX = -dy * 0.2;
                  const offsetY = dx * 0.2;
                  const markerId = `arrow-${fromId}-${toId}`;
                  return (
                    <g key={`edge-${fromId}-${toId}`}>
                      <defs>
                        <marker
                          id={markerId}
                          markerWidth="10"
                          markerHeight="7"
                          refX="10"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={hasCycleDetected ? "#EF4444" : "#3B82F6"}
                          />
                        </marker>
                      </defs>
                      <path
                        d={`M ${fromX} ${fromY} Q ${midX + offsetX} ${
                          midY + offsetY
                        } ${toX} ${toY}`}
                        fill="none"
                        stroke={hasCycleDetected ? "#EF4444" : "#3B82F6"}
                        strokeWidth="2"
                        markerEnd={`url(#${markerId})`}
                        strokeDasharray={hasCycleDetected ? "5,5" : "none"}
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="mt-4 text-sm text-gray-600">
                {executionOrder ? (
                  <span>
                    Edges represent dependencies:
                    <span className="ml-2 inline-block w-4 h-0 border-t-2 border-blue-500"></span>
                    <span className="ml-1">Task depends on prerequisite</span>
                  </span>
                ) : (
                  <span className="text-red-600">
                    Graph contains circular dependencies
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">
                Add tasks and dependencies to visualize the graph
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler;
