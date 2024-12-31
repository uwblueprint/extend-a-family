import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";

const RightSidebar = () => {
  const theme = useTheme();
  const { activePage } = useContext(CourseAuthoringContext);
  return (
    <Box height="100%" bgcolor={theme.palette.Neutral[200]} padding="24px">
      {activePage && activePage.type === "Lesson"
        ? "Alt text form"
        : "Activity type form"}
    </Box>
  );
};

export default RightSidebar;
