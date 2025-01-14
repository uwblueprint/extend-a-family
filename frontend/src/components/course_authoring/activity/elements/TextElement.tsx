import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { TextElementData } from "../../../../types/CourseElementTypes";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";
import CourseAuthoringContext from "../../../../contexts/CourseAuthoringContext";

interface TextElementProps {
  id: string;
  elementData: TextElementData;
}

const TextElement: React.FC<TextElementProps> = ({ id, elementData }) => {
  const { previewMode } = useContext(CourseAuthoringContext);
  const { setActiveElementId } = useContext(ActivityDataContext);
  const { text, fontSize, fontWeight } = elementData;
  return (
    <div
      onMouseDown={() => !previewMode && setActiveElementId(id)}
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
        variant={`body${fontSize}`}
        style={{ margin: "0px", fontWeight, overflowWrap: "break-word" }}
      >
        {text}
      </Typography>
    </div>
  );
};

export default TextElement;
