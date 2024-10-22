import React from "react";
import { Handle, Position } from "reactflow";
import TextComponent from "./TextComponent";

const defaultColor = "black";

export type NodeData = {
  index: number;
  label: string;
  width: number;
  height: number;
  borderColor?: string;
  type: string;
};

type NodeProps = {
  data: NodeData;
  handleType: string;
};

export type NodeType = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
};

const Node: React.FC<NodeProps> = ({ data, handleType }) => {
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

const LeftNode: React.FC<{ data: NodeData }> = ({ data }) => {
  return <Node data={data} handleType="left" />;
};

const RightNode: React.FC<{ data: NodeData }> = ({ data }) => {
  return <Node data={data} handleType="right" />;
};

const MiddleNode: React.FC<{ data: NodeData }> = ({ data }) => {
  return <Node data={data} handleType="middle" />;
};

export const getNodeType = (col: number, numCols: number): string => {
  let nodeType = "";
  if (numCols === 2) {
    nodeType = col % 2 === 0 ? "leftNode" : "rightNode";
  } else {
    if (col % 3 === 0) nodeType = "leftNode";
    if (col % 3 === 1) nodeType = "middleNode";
    if (col % 3 === 2) nodeType = "rightNode";
  }
  return nodeType;
};

// TO DO: This needs to be wrapped in an useMemo as instructed in ReactFlow docs, but doing so breaks the app...
export const nodeTypes = {
  leftNode: LeftNode,
  rightNode: RightNode,
  middleNode: MiddleNode,
};

export default Node;
