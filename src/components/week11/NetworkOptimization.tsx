import React, { useState, useEffect, useRef } from "react";
import { PriorityQueue } from "../../utils/collections/collection";

interface WeightedGraphNode {
  name: string;
  edges: Array<{ target: WeightedGraphNode; weight: number }>;
}

interface WeightedGraph {
  nodes: { [key: string]: WeightedGraphNode };
}

interface MSTResult {
  edges: Array<{ from: string; to: string; weight: number }>;
  totalCost: number;
}

interface PathResult {
  paths: Array<Array<{ from: string; to: string; weight: number }>>;
  totalCost: number;
}

interface PrioritizedNode {
  id: string;
  priority: number;
}

function buildWeightedGraph(
  nodes: string[],
  edges: Array<[string, string, number]>
): WeightedGraph {
  const graph: WeightedGraph = { nodes: {} };

  nodes.forEach((nodeName) => {
    graph.nodes[nodeName] = {
      name: nodeName,
      edges: [],
    };
  });

  edges.forEach(([from, to, weight]) => {
    const fromNode = graph.nodes[from];
    const toNode = graph.nodes[to];

    if (fromNode && toNode) {
      fromNode.edges.push({ target: toNode, weight });
      toNode.edges.push({ target: fromNode, weight });
    }
  });

  return graph;
}

function findMinimumSpanningTree(graph: WeightedGraph): MSTResult {
  const result: MSTResult = {
    edges: [],
    totalCost: 0,
  };

  if (Object.keys(graph.nodes).length === 0) return result;

  const startNode = Object.keys(graph.nodes)[0];
  const visited = new Set<string>([startNode]);
  const edgeQueue: Array<{ from: string; to: string; weight: number }> = [];
  const node = graph.nodes[startNode];
  node.edges.forEach((edge) => {
    edgeQueue.push({
      from: startNode,
      to: edge.target.name,
      weight: edge.weight,
    });
  });

  edgeQueue.sort((a, b) => a.weight - b.weight);

  while (
    edgeQueue.length > 0 &&
    visited.size < Object.keys(graph.nodes).length
  ) {
    const { from, to, weight } = edgeQueue.shift()!;

    if (visited.has(to)) continue;

    visited.add(to);
    result.edges.push({ from, to, weight });
    result.totalCost += weight;

    const newNode = graph.nodes[to];
    newNode.edges.forEach((edge) => {
      if (!visited.has(edge.target.name)) {
        edgeQueue.push({
          from: to,
          to: edge.target.name,
          weight: edge.weight,
        });
      }
    });

    edgeQueue.sort((a, b) => a.weight - b.weight);
  }

  return result;
}

function findMinimumCostPath(
  graph: WeightedGraph,
  startNode: string,
  endNode: string
): PathResult {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const visited = new Set<string>();

  Object.keys(graph.nodes).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[startNode] = 0;

  const queue = new PriorityQueue<PrioritizedNode>();
  queue.enqueue({ id: startNode, priority: 0 });

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
    const currentNodeId = current.id;

    if (visited.has(currentNodeId)) continue;

    visited.add(currentNodeId);

    if (currentNodeId === endNode) break;

    const currentNode = graph.nodes[currentNodeId];
    currentNode.edges.forEach((edge) => {
      const neighborId = edge.target.name;
      const tentativeDistance = distances[currentNodeId] + edge.weight;

      if (tentativeDistance < distances[neighborId]) {
        distances[neighborId] = tentativeDistance;
        previous[neighborId] = currentNodeId;

        queue.enqueue({
          id: neighborId,
          priority: tentativeDistance,
        });
      }
    });
  }

  if (distances[endNode] === Infinity) {
    return { paths: [], totalCost: 0 };
  }

  const path: Array<{ from: string; to: string; weight: number }> = [];
  let current = endNode;

  while (previous[current] !== null) {
    const prev = previous[current]!;
    const weight = graph.nodes[prev].edges.find(
      (edge) => edge.target.name === current
    )!.weight;

    path.unshift({ from: prev, to: current, weight });
    current = prev;
  }

  return {
    paths: [path],
    totalCost: distances[endNode],
  };
}

const NetworkGraphRenderer = ({
  graph,
  mst,
  selectedPath,
}: {
  graph: WeightedGraph;
  mst: MSTResult | null;
  selectedPath: PathResult | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodePositions, setNodePositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<[string, string] | null>(
    null
  );
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const generatePositions = () => {
      const nodes = Object.keys(graph.nodes);
      const positions: { [key: string]: { x: number; y: number } } = {};

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const radius = Math.min(centerX, centerY) - 50;

      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI;
        positions[node] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });

      setNodePositions(positions);
    };

    generatePositions();

    const handleResize = () => {
      if (canvasRef.current) {
        setDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [graph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    Object.keys(graph.nodes).forEach((fromNode) => {
      const node = graph.nodes[fromNode];
      const fromPos = nodePositions[fromNode];

      if (!fromPos) return;

      node.edges.forEach((edge) => {
        const toNode = edge.target.name;
        const toPos = nodePositions[toNode];

        if (!toPos || fromNode > toNode) return;

        const isMstEdge = mst?.edges.some(
          (e) =>
            (e.from === fromNode && e.to === toNode) ||
            (e.from === toNode && e.to === fromNode)
        );

        const isPathEdge = selectedPath?.paths[0].some(
          (e) =>
            (e.from === fromNode && e.to === toNode) ||
            (e.from === toNode && e.to === fromNode)
        );

        ctx.lineWidth = 2;
        if (isPathEdge) {
          ctx.strokeStyle = "#FF5722";
          ctx.lineWidth = 4;
        } else if (isMstEdge) {
          ctx.strokeStyle = "#4CAF50";
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = "#9E9E9E";
        }

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();

        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        ctx.fillStyle = "#000000";
        ctx.font = "14px Arial";
        ctx.fillText(edge.weight.toString(), midX, midY);
      });
    });

    Object.keys(nodePositions).forEach((node) => {
      const pos = nodePositions[node];

      ctx.fillStyle =
        selectedNodes &&
        (selectedNodes[0] === node || selectedNodes[1] === node)
          ? "#FF5722"
          : hoveredNode === node
          ? "#2196F3"
          : "#3F51B5";

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node, pos.x, pos.y);
    });
  }, [
    graph,
    nodePositions,
    hoveredNode,
    selectedNodes,
    mst,
    selectedPath,
    dimensions,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovered: string | null = null;
    Object.keys(nodePositions).forEach((node) => {
      const pos = nodePositions[node];
      const distance = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );

      if (distance <= 20) {
        hovered = node;
      }
    });

    setHoveredNode(hovered);
    canvas.style.cursor = hovered ? "pointer" : "default";
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hoveredNode) return;

    if (!selectedNodes) {
      setSelectedNodes([hoveredNode, ""]);
    } else if (selectedNodes[0] && !selectedNodes[1]) {
      setSelectedNodes([selectedNodes[0], hoveredNode]);
    } else {
      setSelectedNodes([hoveredNode, ""]);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        style={{ border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <div className="mt-2">
        <div className="flex gap-4 items-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 mr-2"></div>
            <span>Regular Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span>MST Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
            <span>Path Edge</span>
          </div>
        </div>

        {selectedNodes && selectedNodes[0] && selectedNodes[1] && (
          <div className="mt-2">
            <p>
              Selected path: {selectedNodes[0]} → {selectedNodes[1]}
            </p>
            {selectedPath && <p>Path cost: {selectedPath.totalCost}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const NetworkOptimization = () => {
  const sampleNodes = ["A", "B", "C", "D", "E", "F", "G"];
  const sampleEdges: Array<[string, string, number]> = [
    ["A", "B", 7],
    ["A", "D", 5],
    ["B", "C", 8],
    ["B", "D", 9],
    ["B", "E", 7],
    ["C", "E", 5],
    ["D", "E", 15],
    ["D", "F", 6],
    ["E", "F", 8],
    ["E", "G", 9],
    ["F", "G", 11],
  ];

  const [graph, setGraph] = useState<WeightedGraph | null>(null);
  const [mst, setMst] = useState<MSTResult | null>(null);
  const [selectedPath, setSelectedPath] = useState<PathResult | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<[string, string] | null>(
    null
  );

  const [nodeInput, setNodeInput] = useState<string>("");
  const [fromNode, setFromNode] = useState<string>("");
  const [toNode, setToNode] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [customNodes, setCustomNodes] = useState<string[]>(sampleNodes);
  const [customEdges, setCustomEdges] =
    useState<Array<[string, string, number]>>(sampleEdges);

  useEffect(() => {
    const newGraph = buildWeightedGraph(customNodes, customEdges);
    setGraph(newGraph);
    const newMst = findMinimumSpanningTree(newGraph);
    setMst(newMst);
  }, [customNodes, customEdges]);

  useEffect(() => {
    if (graph && selectedNodes && selectedNodes[0] && selectedNodes[1]) {
      const path = findMinimumCostPath(
        graph,
        selectedNodes[0],
        selectedNodes[1]
      );
      setSelectedPath(path);
    } else {
      setSelectedPath(null);
    }
  }, [graph, selectedNodes]);

  const handleAddNode = () => {
    if (nodeInput && !customNodes.includes(nodeInput)) {
      setCustomNodes([...customNodes, nodeInput]);
      setNodeInput("");
    }
  };

  const handleAddEdge = () => {
    if (fromNode && toNode && weight && fromNode !== toNode) {
      const weightNum = parseInt(weight, 10);
      if (!isNaN(weightNum) && weightNum > 0) {
        const edgeExists = customEdges.some(
          ([f, t]) =>
            (f === fromNode && t === toNode) || (f === toNode && t === fromNode)
        );

        if (!edgeExists) {
          setCustomEdges([...customEdges, [fromNode, toNode, weightNum]]);
          setFromNode("");
          setToNode("");
          setWeight("");
        }
      }
    }
  };

  const handleReset = () => {
    setCustomNodes(sampleNodes);
    setCustomEdges(sampleEdges);
    setSelectedNodes(null);
    setSelectedPath(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Network Optimization System</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Network Graph</h2>
        {graph && (
          <NetworkGraphRenderer
            graph={graph}
            mst={mst}
            selectedPath={selectedPath}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Add Nodes</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={nodeInput}
              onChange={(e) => setNodeInput(e.target.value)}
              placeholder="Node name"
              className="border rounded px-2 py-1 flex-grow"
            />
            <button
              onClick={handleAddNode}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Add Node
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-2">Add Edges</h2>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={fromNode}
              onChange={(e) => setFromNode(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">From Node</option>
              {customNodes.map((node) => (
                <option key={`from-${node}`} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <select
              value={toNode}
              onChange={(e) => setToNode(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">To Node</option>
              {customNodes.map((node) => (
                <option key={`to-${node}`} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              className="border rounded px-2 py-1"
              min="1"
            />
          </div>
          <button
            onClick={handleAddEdge}
            className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
          >
            Add Edge
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-1 rounded"
          >
            Reset to Sample
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Results</h2>

          <div className="mb-4">
            <h3 className="font-medium">Minimum Spanning Tree</h3>
            {mst && (
              <div>
                <p>Total Cost: {mst.totalCost}</p>
                <ul className="list-disc pl-5">
                  {mst.edges.map((edge, index) => (
                    <li key={index}>
                      {edge.from} → {edge.to} (Weight: {edge.weight})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium">Selected Path</h3>
            {selectedPath && selectedPath.paths.length > 0 ? (
              <div>
                <p>Total Cost: {selectedPath.totalCost}</p>
                <ul className="list-disc pl-5">
                  {selectedPath.paths[0].map((step, index) => (
                    <li key={index}>
                      {step.from} → {step.to} (Weight: {step.weight})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>
                Click on two nodes in the graph to find the minimum cost path.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkOptimization;
