import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UnitSidebar from "./UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import CourseModulesGrid from "../pages/courses/CourseModulesGrid";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);

  const [open, setOpen] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  // have a state be the selected unit based on what is selected on the sidebar ()
  // create a new component for module grid (receives unitID, does the fetching))

  return (
    <Box display="flex" width="100%" height="100%">
      <UnitSidebar
        courseUnits={courseUnits}
        handleClose={handleDrawerClose}
        open={open}
        onSelectUnit={handleSelectUnit}
      />
      {!open && (
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

      <Box sx={{ flexGrow: 1, p: 2 }}>
        {selectedUnit ? (
          <CourseModulesGrid unitId={selectedUnit.id} isSidebarOpen={open} />
        ) : (
          <Typography>Select a unit to view modules.</Typography>
        )}
      </Box>
    </Box>
  );
}
