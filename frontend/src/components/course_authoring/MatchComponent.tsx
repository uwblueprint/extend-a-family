import React, { useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { editComponentDataMap } from "../../utils/GridComponentUtils";
import { update } from "lodash";
import TextComponent from "./TextComponent";

const defaultColor = "black";

const Node = ({ data, handleType }) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid",
        borderRadius: "10px",
        borderColor: data.borderColor || defaultColor,

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
      {data.type === "text" && <TextComponent componentData={data} />}

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

let prevNode = null;

const getCoordinate = (
  gridLength: number,
  row: number,
  numRows: number,
  boxHeight: number,
) => {
  const spacing = (gridLength - boxHeight * numRows) / (numRows - 1);
  const startPoint = row * (boxHeight + spacing);
  return startPoint || 0;
};

interface MatchProps {
  numRows?: number;
  numCols?: number;
  nodePositionToData?: Map<string, object>;
  selectedNode?: { id: string; type: string };
  lastSelectedNode?: { id: string; type: string };
}

interface ComponentProps {
  componentData: Map<string, any>;
  setComponentData: (data: Map<string, object>) => void;
  i: string;
  w: number;
  h: number;
}

const MatchComponent: React.FC<ComponentProps> = ({
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

  const insertNodes = (
    insertRows: number,
    insertCols: number,
    w: number,
    h: number,
  ) => {
    const newNodes = [];

    for (let row = 0; row < insertRows; row++) {
      for (let col = 0; col < insertCols; col++) {
        const nodeData = nodePositionToData.get(`node-${row}-${col}`) || {};
        const nodeWidth = parseInt(nodeData.w) || defaultWidth;
        const nodeHeight = parseInt(nodeData.h) || defaultHeight;

        newNodes.push({
          id: `node-${row}-${col}`,
          type: getNodeType(col, insertCols),
          position: {
            x: getCoordinate(w, col, insertCols, nodeWidth),
            y: getCoordinate(h, row, insertRows, nodeHeight),
          },
          data: {
            label: `node-${row}-${col}`,
            index: row * insertCols + col,
            width: nodeWidth,
            height: nodeHeight,
            ...nodeData,
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
  }, [numRows, numCols, w, h, componentData]);

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
    let updatedComponentDataMap = editComponentDataMap(
      componentData,
      "lastSelectedNode",
      node,
      i,
    );
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
      updatedComponentDataMap = editComponentDataMap(
        updatedComponentDataMap,
        "selectedNode",
        null,
        i,
      );
    } else {
      updatedComponentDataMap = editComponentDataMap(
        updatedComponentDataMap,
        "selectedNode",
        node,
        i,
      );
    }
    setComponentData(updatedComponentDataMap);
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
          proOptions={{ hideAttribution: true }}
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

export default MatchComponent;
