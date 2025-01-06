import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import ActivityGrid from "./activity/ActivityGrid";
import { ActivityContext } from "../../contexts/ActivityContext";

const PageBuilder = () => {
  const theme = useTheme();
  const { activePage, previewMode } = useContext(CourseAuthoringContext);
  const { targetRef } = useContext(ActivityContext);

  return (
    <Box
      ref={targetRef}
      width="100%"
      height="100%"
      borderRadius="8px"
      border={previewMode ? "1px solid" : "1px dashed"}
      borderColor={
        previewMode
          ? theme.palette.Neutral[700]
          : theme.palette.Administrator.Default
      }
      bgcolor={
        previewMode
          ? theme.palette.Neutral[100]
          : theme.palette.Administrator.Light
      }
    >
      {activePage &&
        (activePage.type === "Lesson" ? (
          <Box padding="32px">uploaded stuff</Box>
        ) : (
          <ActivityGrid rows={18} cols={32} />
        ))}
    </Box>
  );
};

export default PageBuilder;
