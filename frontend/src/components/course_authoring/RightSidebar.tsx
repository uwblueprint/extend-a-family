import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import ElementMenu from "./activity/ElementMenu";

const RightSidebar = () => {
  const theme = useTheme();
  const { activePage } = useContext(CourseAuthoringContext);
  return (
    <Box height="100%" bgcolor={theme.palette.Neutral[200]} padding="24px">
      {activePage &&
        (activePage.type === "Lesson" ? (
          <Box>alt text form</Box>
        ) : (
          <ElementMenu />
        ))}
    </Box>
  );
};

export default RightSidebar;
