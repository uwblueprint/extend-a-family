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
  showHeader?: boolean;
  expandAll?: boolean;
}

const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  modules,
  onBookmarkDeleted,
  showHeader = true,
  expandAll = false,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", marginBottom: "80px", boxSizing: "border-box" }}>
      {/* Unit Header */}
      {showHeader && (
        <Typography
          sx={{
            color: "#000",
            font: theme.typography.headlineLarge,
            marginBottom: "32px",
          }}
        >
          Unit {unit.displayIndex}: {unit.title}
        </Typography>
      )}

      {/* Modules */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          width: "100%",
        }}
      >
        {Object.values(modules).map((moduleGroup) => (
          <ModuleSection
            key={moduleGroup.module.id}
            module={moduleGroup.module}
            bookmarks={moduleGroup.bookmarks}
            onBookmarkDeleted={onBookmarkDeleted}
            expandAll={expandAll}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UnitSection;
