export const handleChange = (
  existingData: object,
  field: string,
  value: string,
) => {
  const updatedData = new Map(componentData);
  const currentData = updatedData.get(index) || {};
  const newData = { ...currentData, [field]: value };
  updatedData.set(index, newData);
  setComponentData(updatedData);
};
