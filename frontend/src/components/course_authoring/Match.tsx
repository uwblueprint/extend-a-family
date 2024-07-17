import React, { useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component
const Node = ({ data, handleType }) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #007bff",
        borderRadius: "10px",
        backgroundColor: "#e9ecef",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      {(handleType === "left" || handleType === "middle") && (
        <Handle type="source" position={Position.Right} />
      )}
      <div>{data.label}</div>
      {(handleType === "right" || handleType === "middle") && (
        <Handle type="target" position={Position.Left} />
      )}
    </div>
  );
};

const LeftNode = ({ data }) => {
  return <Node data={data} handleType="left" />;
};

const RightNode = ({ data }) => {
  return <Node data={data} handleType="right" />;
};

const MiddleNode = ({ data }) => {
  return <Node data={data} handleType="middle" />;
};

const getNodeType = (col: number, numCols: number): string => {
  let nodeType = "";
  if (numCols == 2) {
    nodeType = col % 2 === 0 ? "leftNode" : "rightNode";
  } else {
    if (col % 3 === 0) nodeType = "leftNode";
    if (col % 3 === 1) nodeType = "middleNode";
    if (col % 3 === 2) nodeType = "rightNode";
  }
  return nodeType;
};

const nodeTypes = {
  leftNode: LeftNode,
  rightNode: RightNode,
  middleNode: MiddleNode,
};

// Initial nodes positioned in two columns
const initialNodes = [];

const initialEdges = [];

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

  const insertNodes = (
    insertRows: number,
    insertCols: number,
    w: number,
    h: number,
  ) => {
    const newNodes = [];
    for (let row = 0; row < insertRows; row++) {
      for (let col = 0; col < insertCols; col++) {
        newNodes.push({
          id: `node-${row}-${col}`,
          type: getNodeType(col, insertCols),
          position: {
            x: 0 + (col % insertCols) * 200,
            y: row * (h / insertRows),
          },
          data: { label: `Node ${row}-${col}`, index: row * insertCols + col },
        });
      }
    }
    setNodes(newNodes);
  };

  useEffect(() => {
    insertNodes(numRows, numCols, w * 50, h * 50);
  }, [numRows, numCols, w, h]);

  const onNodeClick = (event, node) => {
    if (selectedNode && selectedNode.type !== node.type) {
      setEdges((eds) =>
        addEdge(
          {
            id: `${selectedNode.id}-${node.id}`,
            source:
              selectedNode.type === "leftNode" ? selectedNode.id : node.id,
            target:
              selectedNode.type === "leftNode" ? node.id : selectedNode.id,
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
      <div style={{ height: h * 50 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          zoomOnScroll={false}
          panOnScroll={false}
          zoomOnPinch={false}
          panOnDrag={false}
          minZoom={0.75}
          snapGrid={[15, 15]}
          autoPanOnNodeDrag={false}
        >
          <Background />
          {/* <Controls /> */}
        </ReactFlow>
        {/* <button onClick={handleClear} style={{ marginTop: "10px" }}>
          Clear Connections
        </button> */}
      </div>
    </div>
  );
};

export default Match;
