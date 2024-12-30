import React from "react";
import { Box } from "@mui/material";
import LeftSidebar from "../course_authoring/LeftSidebar";
import RightSidebar from "../course_authoring/RightSidebar";
import MainArea from "../course_authoring/MainArea";

const CourseAuthoringPage = () => {
  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box flexGrow={1} display="flex" flexDirection="row">
        <Box width="20%">
          <LeftSidebar />
        </Box>
        <Box flexGrow={1}>
          <MainArea />
        </Box>
        <Box width="20%">
          <RightSidebar />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseAuthoringPage;
