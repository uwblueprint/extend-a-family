export const editComponentDataMap = (
  componentDataMap: Map<string, any>,
  field: string,
  value: any,
  index: string,
) => {
  const updatedComponentDataMap = new Map(componentDataMap);
  const componentDataByIndex = updatedComponentDataMap.get(index) || {};
  const updatedComponentData = { ...componentDataByIndex, [field]: value };
  updatedComponentDataMap.set(index, updatedComponentData);
  return updatedComponentDataMap;
};

export const editMatchNodeDataMap = (
  componentDataMap: Map<string, any>,
  node: string,
  field: string,
  value: any,
  index: string,
) => {
  const updatedComponentDataMap = new Map(componentDataMap);
  const componentDataByIndex = updatedComponentDataMap.get(index) || {};
  const updatedNodeMap =
    componentDataByIndex?.["nodePositionToData"] || new Map();
  const nodeDataByIndex = updatedNodeMap.get(node) || {};
  const updatedNodeData = { ...nodeDataByIndex, [field]: value };
  updatedNodeMap.set(node, updatedNodeData);
  componentDataByIndex["nodePositionToData"] = updatedNodeMap;
  updatedComponentDataMap.set(index, componentDataByIndex);
  return updatedComponentDataMap;
};
