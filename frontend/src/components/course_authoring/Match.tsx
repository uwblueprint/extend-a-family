import React, { useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const defaultColor = "black";

// Custom Node Component
const Node = ({ data, handleType }) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid",
        borderRadius: "10px",
        borderColor: data.borderColor || defaultColor,
        backgroundColor: "#e9ecef",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        height: data.height,
        width: data.width,
      }}
      onMouseEnter={(e) => {
        // e.currentTarget.style.transform = "translateY(-5px)";
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

const defaultWidth = 75;
const defaultHeight = 75;

const temp_dimensions = {
  "node-0-0": { width: 75, height: 75 },
  "node-0-1": { width: 75, height: 75 },
  "node-0-2": { width: 75, height: 75 },
  "node-1-0": { width: 75, height: 75 },
  "node-1-1": { width: 100, height: 75 },
  "node-1-2": { width: 150, height: 75 },
  "node-2-0": { width: 75, height: 75 },
  "node-2-1": { width: 75, height: 75 },
  "node-2-2": { width: 75, height: 75 },
};

let prevNode = null;

const getXcoord = (
  gridWidth: number,
  col: number,
  numCols: number,
  boxWidth: number,
) => {
  if (col == 0) {
    return 0;
  }

  if (numCols == 2) {
    return gridWidth - boxWidth;
  }

  if (numCols == 3) {
    const midpoint = gridWidth / 2;
    if (col == 1) {
      return midpoint - boxWidth / 2;
    }
    return gridWidth - boxWidth;
  }

  return 0; // this case should never happen as long as max 3 columns
};

interface MatchProps {
  numRows?: number;
  numCols?: number;
  nodePositionToData?: Map<string, object>;
  selectedNode?: { id: string; type: string };
  lastSelectedNode?: { id: string; type: string };
}

interface ComponentProps {
  componentData: Map<string, MatchProps>;
  setComponentData: (data: Map<string, object>) => void;
  i: string;
  w: number;
  h: number;
}

const Match: React.FC<ComponentProps> = ({
  componentData,
  setComponentData,
  i,
  w,
  h,
}) => {
  const {
    numRows = 0,
    numCols = 0,
    nodePositionToData = new Map<string, object>(),
    selectedNode = null,
    lastSelectedNode = null,
  } = componentData.get(i) || {};

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleChange = (
    field: string,
    value: any,
    currentComponentData = componentData,
  ) => {
    const updatedData = new Map<any, any>(currentComponentData);
    const currentData = updatedData.get(i) || {};
    const newData = { ...currentData, [field]: value };
    updatedData.set(i, newData);
    setComponentData(updatedData);
    return updatedData;
  };

  const insertNodes = (
    insertRows: number,
    insertCols: number,
    w: number,
    h: number,
  ) => {
    const newNodes = [];
    for (let row = 0; row < insertRows; row++) {
      for (let col = 0; col < insertCols; col++) {
        const nodeWidth =
          nodePositionToData[`node-${row}-${col}`]?.width ?? defaultWidth;
        const nodeHeight =
          nodePositionToData[`node-${row}-${col}`]?.height ?? defaultHeight;
        newNodes.push({
          id: `node-${row}-${col}`,
          type: getNodeType(col, insertCols),
          position: {
            x: getXcoord(w, col, insertCols, nodeWidth),
            y: row * (h / insertRows),
          },
          data: {
            label: `Node ${row}-${col}`,
            index: row * insertCols + col,
            width: nodeWidth,
            height: nodeHeight,
          },
        });
      }
    }
    setNodes(newNodes);
  };

  const modifyNodes = (id: string, data: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    );
  };

  useEffect(() => {
    insertNodes(numRows, numCols, w * 50, h * 50);
  }, [numRows, numCols, w, h]);

  const setCurrentNodeAndStyle = (node) => {
    if (prevNode) {
      modifyNodes(prevNode.id, { borderColor: defaultColor });
    }
    if (!node) {
      setSelectedNode(null);
      return;
    }
    if ((prevNode && prevNode.id !== node.id) || !prevNode) {
      modifyNodes(node.id, { borderColor: "blue" });
    } else {
      modifyNodes(node.id, { borderColor: defaultColor });
      prevNode = null;
    }
    prevNode = node;
    setSelectedNode(node);
  };

  const onNodeClick = (event, node) => {
    let updatedData = handleChange("lastSelectedNode", node);
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
      handleChange("selectedNode", null, updatedData);
    } else {
      handleChange("selectedNode", node, updatedData);
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
          {/* <Background /> */}
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
