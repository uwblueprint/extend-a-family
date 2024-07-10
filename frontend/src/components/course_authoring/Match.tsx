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
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid black",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Initial nodes positioned in two columns
const initialNodes = [
  {
    id: "1",
    type: "customNode",
    data: { label: "Left1" },
    position: { x: 0, y: 50 },
  },
  {
    id: "2",
    type: "customNode",
    data: { label: "Left2" },
    position: { x: 0, y: 150 },
  },
  {
    id: "3",
    type: "customNode",
    data: { label: "Left3" },
    position: { x: 0, y: 250 },
  },
  {
    id: "4",
    type: "customNode",
    data: { label: "Right1" },
    position: { x: 200, y: 50 },
  },
  {
    id: "5",
    type: "customNode",
    data: { label: "Right2" },
    position: { x: 200, y: 150 },
  },
  {
    id: "6",
    type: "customNode",
    data: { label: "Right3" },
    position: { x: 200, y: 250 },
  },
];

const initialEdges = [];

const nodeTypes = { customNode: CustomNode };

interface MatchProps {
  verticalAlign?: string;
  fontWeight?: string;
  horizontalAlign?: string;
  fontSize?: string;
}
interface ComponentProps {
  componentData?: MatchProps;
}

const Match: React.FC<ComponentProps> = ({ componentData }) => {
  const {
    verticalAlign = "center",
    fontWeight = "normal",
    horizontalAlign = "center",
    fontSize = "14px",
  } = componentData || {};

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (event, node) => {
    if (selectedNode) {
      setEdges((eds) =>
        addEdge(
          {
            id: `${selectedNode.id}-${node.id}`,
            source: selectedNode.id,
            target: node.id,
            type: "smoothstep",
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
        alignContent: verticalAlign,
        justifyContent: horizontalAlign,
        textAlign: "center",
        fontWeight,
        fontSize,
      }}
    >
      <p style={{ margin: "0px" }}> Match Box </p>
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
