export const editComponentDataMap = (
  componentDataMap: Map<string, object>,
  field: string,
  value: any,
  index: string,
) => {
  console.log(componentDataMap, field, value, index);
  const updatedComponentDataMap = new Map(componentDataMap);
  const componentDataByIndex = updatedComponentDataMap.get(index) || {};
  const updatedComponentData = { ...componentDataByIndex, [field]: value };
  updatedComponentDataMap.set(index, updatedComponentData);
  return updatedComponentDataMap;
};
