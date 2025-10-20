import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { CourseUnit, CourseModule } from "../../types/CourseTypes";
import ModuleSection from "./ModuleSection";

interface UnitSectionProps {
  unit: CourseUnit;
  modules: {
    [moduleId: string]: {
      module: CourseModule;
      bookmarks: Array<{
        id: string;
        title: string;
        type: string;
        unitId: string;
        moduleId: string;
        pageId: string;
      }>;
    };
  };
  onBookmarkDeleted?: (pageId: string) => void;
}

const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  modules,
  onBookmarkDeleted,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ marginBottom: "80px" }}>
      {/* Unit Header */}
      <Typography
        variant="titleLarge"
        sx={{
          marginBottom: "40px",
          color: theme.palette.Learner.Default,
          borderBottom: `3px solid ${theme.palette.Learner.Default}`,
          paddingBottom: "20px",
          fontWeight: 700,
        }}
      >
        Unit {unit.displayIndex}: {unit.title}
      </Typography>

      {/* Modules */}
      {Object.values(modules).map((moduleGroup) => (
        <ModuleSection
          key={moduleGroup.module.id}
          module={moduleGroup.module}
          bookmarks={moduleGroup.bookmarks}
          onBookmarkDeleted={onBookmarkDeleted}
        />
      ))}
    </Box>
  );
};

export default UnitSection;
