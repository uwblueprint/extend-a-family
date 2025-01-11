import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { TextElementData } from "../../../../types/CourseElementTypes";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";

interface TextElementProps {
  id: string;
  elementData: TextElementData;
}

const TextElement: React.FC<TextElementProps> = ({ id, elementData }) => {
  const { activeElementId, setActiveElementId } =
    useContext(ActivityDataContext);
  const { text, fontSize, fontWeight } = elementData;
  return (
    <div
      onMouseDown={() => setActiveElementId(activeElementId === id ? null : id)}
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Typography
        variant={`display${fontSize}`}
        style={{ margin: "0px", fontWeight, overflowWrap: "break-word" }}
      >
        {text}
      </Typography>
    </div>
  );
};

export default TextElement;
