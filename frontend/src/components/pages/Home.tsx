import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useUser } from "../../hooks/useUser";
import UnitSidebar from "../course_viewing/sidebar/UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";

const HomeContent = () => {
  return (
    <div>
      <div>Currently under construction 🛠️</div>
    </div>
  );
};

const Home = (): React.ReactElement => {
  const user = useUser();
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <UnitSidebar
        open={sidebarOpen}
        handleClose={handleCloseSidebar}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        sidebarTitle="Get started with a unit!"
      />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <div>
          {!sidebarOpen && (
            <Button
              type="button"
              sx={{
                color: theme.palette.Neutral[700],
                backgroundColor: theme.palette.Neutral[200],
                borderRadius: "4px",
                width: "34px",
                minWidth: "34px",
                height: "34px",
                padding: 0,
                marginRight: "12px",
                mb: 2,
              }}
              onClick={handleOpenSidebar}
            >
              <MenuOpenIcon
                sx={{
                  fontSize: "18px",
                  transform: "scaleX(-1)",
                }}
              />
            </Button>
          )}
          <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Hello, {user.firstName}!
          </div>
          <div style={{ height: "2rem" }} />
          <HomeContent />
        </div>
      </Box>
    </Box>
  );
};

export default Home;
