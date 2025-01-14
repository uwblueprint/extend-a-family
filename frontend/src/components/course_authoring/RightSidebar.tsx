import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import ElementMenu from "./activity/ElementMenu";
import { ActivityDataContext } from "../../contexts/ActivityDataContext";
import TextDataForm from "./activity/data_forms/TextDataForm";
import { DisplayElementType } from "../../types/CourseElementTypes";

const RightSidebar = () => {
  const theme = useTheme();
  const { activePage, previewMode } = useContext(CourseAuthoringContext);
  const { elements, activeElementId } = useContext(ActivityDataContext);

  const DataForm = () => {
    if (!activeElementId) {
      return <ElementMenu />;
    }
    const elementData = elements.get(activeElementId);
    if (!elementData) {
      return <></>;
    }

    const { type } = elementData;
    if (type === DisplayElementType.Text) {
      return <TextDataForm id={activeElementId} />;
    }

    return <></>;
  };

  return (
    <Box height="100vh" padding="24px" bgcolor={theme.palette.Neutral[200]}>
      {!previewMode &&
        activePage &&
        (activePage.type === "Lesson" ? (
          <Box>alt text form</Box>
        ) : (
          <DataForm />
        ))}
    </Box>
  );
};

export default RightSidebar;
