import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
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
  const { text, fontSize, fontWeight, textAlign } = elementData;
  return (
    <Box
      onMouseDown={() => !previewMode && setActiveElementId(id)}
      className="drag-handle"
      sx={{
        width: "100%",
        height: "100%",
        padding: "8px",
        textAlign: textAlign.toLowerCase(),
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
    </Box>
  );
};

export default TextElement;
