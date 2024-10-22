import { NodeType } from "../components/course_authoring/Node";

export const editComponentDataMap = (
  componentDataMap: Map<
    string,
    {
      numRows?: number;
      numCols?: number;
      nodePositionToData?: Map<string, object>;
      selectedNode?: NodeType;
    }
  >,
  field: string,
  node: NodeType | null,
  index: string,
) => {
  const updatedComponentDataMap = new Map(componentDataMap);
  const componentDataByIndex = updatedComponentDataMap.get(index) || {};
  const updatedComponentData = { ...componentDataByIndex, [field]: node };
  updatedComponentDataMap.set(index, updatedComponentData);
  return updatedComponentDataMap;
};

export const editMatchNodeDataMap = (
  componentDataMap: Map<
    string,
    {
      numRows?: number;
      numCols?: number;
      nodePositionToData?: Map<string, object>;
      selectedNode?: NodeType;
    }
  >,
  nodeIndex: string,
  field: string,
  node: NodeType,
  index: string,
) => {
  const updatedComponentDataMap = new Map(componentDataMap);
  const componentDataByIndex = updatedComponentDataMap.get(index) || {};
  const updatedNodeMap = componentDataByIndex?.nodePositionToData || new Map();
  const nodeDataByIndex = updatedNodeMap.get(nodeIndex) || {};
  const updatedNodeData = { ...nodeDataByIndex, [field]: node };
  updatedNodeMap.set(nodeIndex, updatedNodeData);
  componentDataByIndex.nodePositionToData = updatedNodeMap;
  updatedComponentDataMap.set(index, componentDataByIndex);
  return updatedComponentDataMap;
};
