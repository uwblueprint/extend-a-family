import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component
const LeftNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid black",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const RightNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid black",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
    </div>
  );
};

// Initial nodes positioned in two columns
const initialNodes = [
  {
    id: "1",
    type: "leftNode",
    data: { label: "Left1" },
    position: { x: 0, y: 50 },
  },
  {
    id: "2",
    type: "leftNode",
    data: { label: "Left2" },
    position: { x: 0, y: 150 },
  },
  {
    id: "3",
    type: "leftNode",
    data: { label: "Left3" },
    position: { x: 0, y: 250 },
  },
  {
    id: "4",
    type: "rightNode",
    data: { label: "Right1" },
    position: { x: 200, y: 50 },
  },
  {
    id: "5",
    type: "rightNode",
    data: { label: "Right2" },
    position: { x: 200, y: 150 },
  },
  {
    id: "6",
    type: "rightNode",
    data: { label: "Right3" },
    position: { x: 200, y: 250 },
  },
];

const initialEdges = [];

const nodeTypes = { leftNode: LeftNode, rightNode: RightNode};

interface MatchProps {
  numRows?: number;
  numCols?: number;
}
interface ComponentProps {
  componentData?: MatchProps;
  i: string;
  w: number;
  h: number;
}


const Match: React.FC<ComponentProps> = ({ componentData, i, w, h }) => {
  const { numRows = 0, numCols = 0 } = componentData || {};

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (event, node) => {

    if (selectedNode && selectedNode.type !== node.type) {
      setEdges((eds) =>
        addEdge(
          {
            id: `${selectedNode.id}-${node.id}`,
            source: selectedNode.type == 'leftNode' ? selectedNode.id : node.id,
            target: selectedNode.type == 'leftNode' ? node.id : selectedNode.id,
            animated: true,
            style: { stroke: "blue" },
          },
          eds,
        ),
      );
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleClear = () => {
    setEdges([]);
  };

  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <p>
        {w * 50} {h * 50}
      </p>
      <div style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          {/* <Controls /> */}
        </ReactFlow>
        <button onClick={handleClear} style={{ marginTop: "10px" }}>
          Clear Connections
        </button>
      </div>
    </div>
  );
};

export default Match;
