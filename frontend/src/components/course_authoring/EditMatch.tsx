import React from "react";

interface MatchProps {
  numRows?: number;
  numCols?: number;
  nodePositionToData?: Map<string, object>;
  selectedNode?: { id: string; type: string };
  lastSelectedNode?: { id: string; type: string };
}

interface EditMatchProps {
  componentData: Map<string, MatchProps>;
  setComponentData: (data: Map<string, object>) => void;
  index: string;
}

const Match: React.FC<EditMatchProps> = ({
  componentData,
  setComponentData,
  index,
}) => {
  const {
    numRows = 0,
    numCols = 0,
    nodePositionToData = new Map<string, object>(),
    selectedNode = null,
    lastSelectedNode = { id: "sdfsdf", type: "" },
  } = componentData.get(index) || {};

  const handleChange = (field: string, value: string) => {
    const updatedData = new Map(componentData);
    const currentData = updatedData.get(index) || {};
    const newData = { ...currentData, [field]: value };
    updatedData.set(index, newData);
    setComponentData(updatedData);
  };

  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
          marginTop: "50px",
        }}
      >
        <label htmlFor="numRows">
          R:
          <input
            type="number"
            min={0}
            max={5}
            id="numRows"
            name="numRows"
            style={{ marginLeft: "10px", width: "40px" }}
            onChange={(e) => handleChange("numRows", e.target.value)}
          />
        </label>
        <label htmlFor="numCols">
          C:
          <input
            type="number"
            min={0}
            max={5}
            id="numCols"
            name="numCols"
            style={{ marginLeft: "10px", width: "40px" }}
            onChange={(e) => handleChange("numCols", e.target.value)}
          />
        </label>
        <p>{lastSelectedNode?.id}</p>
      </div>
    </div>
  );
};

export default Match;
