import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import MainArea from "./MainArea";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import { CourseElement, CoursePage } from "../../types/CourseTypes";

const CourseAuthoringPage = () => {
  const [activePage, setActivePage] = useState<CoursePage | null>(null);
  const [activeElement, setActiveElement] = useState<CourseElement | null>(
    null,
  );
  return (
    <CourseAuthoringContext.Provider
      value={{ activePage, setActivePage, activeElement, setActiveElement }}
    >
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
    </CourseAuthoringContext.Provider>
  );
};

export default CourseAuthoringPage;
