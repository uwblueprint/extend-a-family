import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import ActivityGrid from "./activity/ActivityGrid";
import { ActivityContext } from "../../contexts/ActivityContext";

const PageBuilder = () => {
  const theme = useTheme();
  const { activePage } = useContext(CourseAuthoringContext);
  const { targetRef } = useContext(ActivityContext);

  return (
    <Box
      ref={targetRef}
      width="100%"
      height="100%"
      border="1px dashed"
      borderRadius="8px"
      borderColor={theme.palette.Administrator.Default}
      bgcolor={theme.palette.Administrator.Light}
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
