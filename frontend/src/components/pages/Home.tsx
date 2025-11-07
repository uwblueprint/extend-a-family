// import React from "react";

// const HomeContent = () => {
//   return (
//     <div>
//       <div>Currently under construction 🛠️</div>
//     </div>
//   );
// };

// const Home = (): React.ReactElement => {
//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Home Page</h1>
//       <div style={{ height: "2rem" }} />
//       <HomeContent />
//     </div>
//   );
// };

// export default Home;

import React, { useState } from "react";
import { Box } from "@mui/material";
import UnitSidebar from "../course_viewing/sidebar/UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";

const Home = (): React.ReactElement => {
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // const handleDrawerOpen = () => {
  //   setSidebarOpen(true);
  // };

  const handleDrawerClose = () => {
    setSidebarOpen(true);
  };

  return (
    <Box display="flex" width="100%">
      <UnitSidebar
        setSelectedUnit={setSelectedUnit}
        handleClose={handleDrawerClose}
        open={sidebarOpen}
        selectedUnit={selectedUnit}
      />
    </Box>
  );
};

export default Home;
