import React, { useContext } from "react";
import { DisplayElementType } from "../../../../types/CourseElementTypes";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";

interface TextDataFormProps {
  id: string;
}

const TextDataForm: React.FC<TextDataFormProps> = ({ id }) => {
  const { elements, setElements } = useContext(ActivityDataContext);

  const handleChange = (field: string, value: string) => {
    const updatedData = new Map(elements);
    const currentData = updatedData.get(id) || {};
    const newData = {
      ...currentData,
      [field]: value,
      type: DisplayElementType.Text,
    };
    updatedData.set(id, newData);
    setElements(updatedData);
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
            name="vertical_align"
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

export default TextDataForm;
