import React, { useState } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UnitSidebar from "./sidebar/UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";
import CourseModulesGrid from "./CourseModulesGrid";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box display="flex" width="100%">
      <UnitSidebar
        setSelectedUnit={setSelectedUnit}
        handleClose={handleDrawerClose}
        open={sidebarOpen}
        selectedUnit={selectedUnit}
      />

      <Box sx={{ flexGrow: 1, p: "48px" }}>
        {selectedUnit ? (
          <Stack spacing="14px">
            <Box display="flex" alignItems="center" paddingLeft="10px">
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
                  }}
                  onClick={handleDrawerOpen}
                >
                  <MenuOpenIcon
                    sx={{
                      fontSize: "18px",
                      transform: "scaleX(-1)",
                    }}
                  />
                </Button>
              )}
              <Typography variant="headlineLarge" display="inline">
                Unit {selectedUnit.displayIndex}: {selectedUnit.title}
              </Typography>
            </Box>
            <CourseModulesGrid
              unitId={selectedUnit.id}
              isSidebarOpen={sidebarOpen}
            />
          </Stack>
        ) : (
          <Typography>Loading units...</Typography>
        )}
      </Box>
    </Box>
  );
}
