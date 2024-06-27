import React from "react";

interface EditTextBoxProps {
  componentData: Map<string, object>;
  setComponentData: (data: Map<string, object>) => void;
  index: string;
}

const EditTextBox: React.FC<EditTextBoxProps> = ({
  componentData,
  setComponentData,
  index,
}) => {
  const handleChange = (field: string, value: string) => {
    const updatedData = new Map(componentData);
    updatedData.set(index, { ...updatedData.get(index), [field]: value });
    setComponentData(updatedData);
  };

  return (
    <div
      className={"drag-handle"}
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
        <input
          type="radio"
          id="bold"
          name="font_weight"
          value="bold"
          onChange={() => handleChange("fontWeight", "bold")}
        />
        <label htmlFor="bold">Bold</label>
      </div>
      <div>
        <input
          type="radio"
          id="normal"
          name="font_weight"
          value="normal"
          onChange={() => handleChange("fontWeight", "normal")}
        />
        <label htmlFor="normal">Normal</label>
      </div>
      <b>Vertical Align:</b>
      <div>
        <input
          type="radio"
          id="flex-start-vertical"
          name="vertical_align"
          value="flex-start"
          onChange={() => handleChange("verticalAlign", "flex-start")}
        />
        <label htmlFor="flex-start-vertical">Top</label>
      </div>
      <div>
        <input
          type="radio"
          id="center-vertical"
          name="vertical_align"
          value="center"
          onChange={() => handleChange("verticalAlign", "center")}
        />
        <label htmlFor="center-vertical">Center</label>
      </div>
      <div>
        <input
          type="radio"
          id="flex-end-vertical"
          name="vertical_align"
          value="flex-end"
          onChange={() => handleChange("verticalAlign", "flex-end")}
        />
        <label htmlFor="flex-end-vertical">Bottom</label>
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
