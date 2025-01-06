import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import MainArea from "./MainArea";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import { CoursePage } from "../../types/CourseTypes";
import { ActivityContextProvider } from "../../contexts/ActivityContext";

const CourseAuthoringPage = () => {
  const [activePage, setActivePage] = useState<CoursePage | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  return (
    <CourseAuthoringContext.Provider
      value={{ activePage, setActivePage, previewMode, setPreviewMode }}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <Box flexGrow={1} display="flex" flexDirection="row">
          <Box width="20%">
            <LeftSidebar />
          </Box>
          <ActivityContextProvider>
            <Box flexGrow={1}>
              <MainArea />
            </Box>
            <Box width="20%">
              <RightSidebar />
            </Box>
          </ActivityContextProvider>
        </Box>
      </Box>
    </CourseAuthoringContext.Provider>
  );
};

export default CourseAuthoringPage;
