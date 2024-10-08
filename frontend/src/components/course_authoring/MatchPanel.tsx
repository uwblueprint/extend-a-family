import React from "react";
import {
  editComponentDataMap,
  editMatchNodeDataMap,
} from "../../utils/GridComponentUtils";
import TextPanel from "./TextPanel";

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

const MatchPanel: React.FC<EditMatchProps> = ({
  componentData,
  setComponentData,
  index,
}) => {
  const {
    nodePositionToData = new Map<
      string,
      { w: number; h: number; type: string }
    >(),
    lastSelectedNode = { id: "10000", type: "" },
  } = componentData.get(index) || {};

  const handleChange = (
    field: string,
    value: string,
    nodeId: string | null = null,
  ) => {
    let updatedComponentData;
    if (nodeId) {
      updatedComponentData = editMatchNodeDataMap(
        componentData,
        nodeId,
        field,
        value,
        index,
      );
    } else {
      updatedComponentData = editComponentDataMap(
        componentData,
        field,
        value,
        index,
      );
    }
    setComponentData(updatedComponentData);
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
            value={componentData.get(index)?.numRows || 0}
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
            value={componentData.get(index)?.numCols || 0}
            id="numCols"
            name="numCols"
            style={{ marginLeft: "10px", width: "40px" }}
            onChange={(e) => handleChange("numCols", e.target.value)}
          />
        </label>
      </div>
      {lastSelectedNode?.id != "10000" && <p>{lastSelectedNode?.id}</p>}
      {lastSelectedNode?.id != "10000" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <label htmlFor="width">
            W:
            <input
              type="range"
              min={0}
              max={100}
              value={nodePositionToData.get(lastSelectedNode?.id)?.w || 75}
              id="width"
              name="width"
              style={{ marginLeft: "10px", width: "100px" }}
              onChange={(e) =>
                handleChange("w", e.target.value, lastSelectedNode?.id)
              }
            />
          </label>
          <label htmlFor="height">
            H:
            <input
              type="range"
              min={0}
              max={100}
              value={nodePositionToData.get(lastSelectedNode?.id)?.h || 75}
              id="height"
              name="height"
              style={{ marginLeft: "10px", width: "100px", marginTop: "10px" }}
              onChange={(e) =>
                handleChange("h", e.target.value, lastSelectedNode?.id)
              }
            />
          </label>
          <label htmlFor="dropdown">Type:</label>
          <select
            id="dropdown"
            value={nodePositionToData.get(lastSelectedNode?.id)?.type || ""}
            onChange={(e) => {
              handleChange("type", e.target.value, lastSelectedNode?.id);
            }}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="text">Text</option>
            <option value="picture">Picture</option>
          </select>
          {nodePositionToData.get(lastSelectedNode?.id)?.type === "text" && (
            <TextPanel
              setComponentData={setComponentData}
              componentData={componentData}
              index={index}
              node={lastSelectedNode?.id}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MatchPanel;
