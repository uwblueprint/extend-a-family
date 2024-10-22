import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, { addEdge, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { editComponentDataMap } from "../../utils/GridComponentUtils";
import { getNodeType, nodeTypes, NodeType } from "./Node";

// Initial nodes positioned in two columns
const initialNodes: NodeType[] = [];

const initialEdges: Edge[] = [];

const defaultWidth = "75";
const defaultHeight = "75";

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

interface ComponentProps {
  componentData: Map<
    string,
    {
      numRows?: number;
      numCols?: number;
      nodePositionToData?: Map<string, { w: string; h: string }>;
      selectedNode?: NodeType;
    }
  >;
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
    nodePositionToData = new Map<string, { w: string; h: string }>(),
    selectedNode = null,
  } = componentData.get(i) || {};

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const insertNodes = (
    insertRows: number,
    insertCols: number,
    width: number,
    height: number,
  ) => {
    const newNodes = [];

    for (let row = 0; row < insertRows; row += 1) {
      for (let col = 0; col < insertCols; col += 1) {
        const nodeData = nodePositionToData.get(`node-${row}-${col}`) || { w: defaultWidth, h: defaultHeight };
        const nodeWidth = parseInt(nodeData.w, 10);
        const nodeHeight = parseInt(nodeData.h, 10);

        newNodes.push({
          id: `node-${row}-${col}`,
          type: getNodeType(col, insertCols),
          position: {
            x: getCoordinate(width, col, insertCols, nodeWidth),
            y: getCoordinate(height, row, insertRows, nodeHeight),
          },
          data: {
            label: `node-${row}-${col}`,
            index: row * insertCols + col,
            width: nodeWidth,
            height: nodeHeight,
            type: getNodeType(col, insertCols),
            ...nodeData,
          },
        });
      }
    }
    setNodes(newNodes);
  };

  //

  useEffect(() => {
    insertNodes(numRows, numCols, w * 50, h * 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRows, numCols, w, h, componentData]);

  const onNodeClick = (event: React.MouseEvent, node: NodeType) => {
    let updatedComponentDataMap = editComponentDataMap(
      componentData,
      "lastSelectedNode",
      node,
      i,
    );
    if (selectedNode && selectedNode.type !== node.type) {
      setEdges((eds) => {
        const edgeExists = eds.some(
          (edge) =>
            (edge.source === selectedNode.id && edge.target === node.id) ||
            (edge.source === node.id && edge.target === selectedNode.id),
        );

        if (edgeExists) {
          return eds.filter(
            (edge) =>
              !(
                (edge.source === selectedNode.id && edge.target === node.id) ||
                (edge.source === node.id && edge.target === selectedNode.id)
              ),
          );
        }

        return addEdge(
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
        );
      });
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

  const onConnect = useCallback(
    (params: Edge) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "blue" } }, eds),
      ),
    [],
  );

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
          onConnect={onConnect}
          zoomOnPinch={false}
          panOnDrag={false}
          preventScrolling
          minZoom={0.75}
          snapGrid={[15, 15]}
          autoPanOnNodeDrag={false}
          autoPanOnConnect={false}
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

// This code below should add a blue highlight around currently selected node
// const defaultColor = "black";
// let prevNode: NodeType | null = null;

// const setCurrentNodeAndStyle = (node) => {
//   if (prevNode) {
//     modifyNodes(prevNode.id, { borderColor: defaultColor });
//   }
//   if (!node) {
//     setSelectedNode(null);
//     return;
//   }
//   if ((prevNode && prevNode.id !== node.id) || !prevNode) {
//     modifyNodes(node.id, { borderColor: "blue" });
//   } else {
//     modifyNodes(node.id, { borderColor: defaultColor });
//     prevNode = null;
//   }
//   prevNode = node;
//   setSelectedNode(node);
// };

// const modifyNodes = (id: string, data: any) => {
//   setNodes((prevNodes) =>
//     prevNodes.map((node) => {
//       if (node.id === id) {
//         return {
//           ...node,
//           data: {
//             ...node.data,
//             ...data,
//           },
//         };
//       }
//       return node;
//     }),
//   );
// };
