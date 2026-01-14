import React, { useMemo } from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { CourseUnit, CourseModule } from "../../types/CourseTypes";
import UnitSection from "./UnitSection";

interface FinishedModulesContentProps {
  units: CourseUnit[];
  modules: { [unitId: string]: CourseModule[] };
  loading: boolean;
  error: string | null;
  allExpanded?: boolean;
  expandAllStamp?: number;
  onUnitOpenStateChange?: (unitId: string, isOpen: boolean) => void;
  getModuleCompletionDate?: (moduleId: string) => string | null;
}

const FinishedModulesContent: React.FC<FinishedModulesContentProps> = ({
  units,
  modules,
  loading,
  error,
  allExpanded = false,
  expandAllStamp = 0,
  onUnitOpenStateChange,
  getModuleCompletionDate,
}) => {
  const theme = useTheme();

  const sortedUnits = useMemo(() => {
    return [...units].sort((a, b) => a.displayIndex - b.displayIndex);
  }, [units]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error" variant="bodyLarge">
          {error}
        </Typography>
      </Box>
    );
  }

  if (units.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="bodyLarge" color={theme.palette.Neutral[500]}>
          No modules available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      {/* Unit Sections */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          width: "100%",
        }}
      >
        {sortedUnits.map((unit) => (
          <UnitSection
            key={unit.id}
            unit={unit}
            modules={modules[unit.id] || []}
            expandAll={allExpanded}
            expandAllStamp={expandAllStamp}
            onToggle={(isOpen) => {
              if (onUnitOpenStateChange) {
                onUnitOpenStateChange(unit.id, isOpen);
              }
            }}
            getModuleCompletionDate={getModuleCompletionDate}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FinishedModulesContent;
