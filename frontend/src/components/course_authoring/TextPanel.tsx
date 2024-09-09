import React from "react";
import {
  editComponentDataMap,
  editMatchNodeDataMap,
} from "../../utils/GridComponentUtils";

interface EditTextBoxProps {
  componentData: Map<string, object>;
  setComponentData: (data: Map<string, object>) => void;
  index: string;
  node?: string;
}

const EditTextBox: React.FC<EditTextBoxProps> = ({
  componentData,
  setComponentData,
  index,
  node = null,
}) => {
  const handleChange = (field: string, value: string) => {
    let updatedComponentData;
    if (node) {
      updatedComponentData = editMatchNodeDataMap(
        componentData,
        node,
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ height: "30px" }} />
      <b>Font Weight:</b>
      <div>
        <label htmlFor="bold">
          <input
            type="radio"
            id="bold"
            name="font_weight"
            value="bold"
            onChange={() => handleChange("fontWeight", "bold")}
          />
          Bold
        </label>
      </div>
      <div>
        <label htmlFor="normal">
          <input
            type="radio"
            id="normal"
            name="font_weight"
            value="bold"
            onChange={() => handleChange("fontWeight", "normal")}
          />
          Normal
        </label>
      </div>
      <b>Vertical Align:</b>
      <div>
        <label htmlFor="flex-start-vertical">
          <input
            type="radio"
            id="flex-start-vertical"
            value="flex-start"
            onChange={() => handleChange("verticalAlign", "flex-start")}
          />
          Top
        </label>
      </div>
      <div>
        <label htmlFor="center-vertical">
          <input
            type="radio"
            id="center-vertical"
            name="vertical_align"
            value="center"
            onChange={() => handleChange("verticalAlign", "center")}
          />
          Center
        </label>
      </div>
      <div>
        <label htmlFor="flex-end-vertical">
          <input
            type="radio"
            id="flex-end-vertical"
            name="vertical_align"
            value="flex-end"
            onChange={() => handleChange("verticalAlign", "flex-end")}
          />
          Bottom
        </label>
      </div>

      <input
        type="text"
        placeholder="Text Box Content"
        onChange={(e) => handleChange("content", e.target.value)}
      />
    </div>
  );
};

export default EditTextBox;
