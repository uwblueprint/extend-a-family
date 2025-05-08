import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UnitSidebar from "./UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import CourseModulesGrid from "./CourseModulesGrid";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const getCouseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);

      // Set selectedUnit to the first unit if data is not empty
      if (data.length > 0) {
        setSelectedUnit(data[0]);
      }
    };
    getCouseUnits();
  }, []);

  const handleSelectUnit = (unit: CourseUnit) => {
    setSelectedUnit(unit);
  };

  return (
    <Box display="flex" width="100%">
      <UnitSidebar
        courseUnits={courseUnits}
        setCourseUnits={setCourseUnits}
        handleClose={handleDrawerClose}
        open={sidebarOpen}
        onSelectUnit={handleSelectUnit}
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
