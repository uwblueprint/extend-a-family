import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  expandAllStamp?: number;
  onModuleOpenStateChange?: (
    unitId: string,
    state: Record<string, boolean>,
  ) => void;
}

const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  modules,
  onBookmarkDeleted,
  showHeader = true,
  expandAll = false,
  expandAllStamp = 0,
  onModuleOpenStateChange,
}) => {
  const theme = useTheme();

  // Sort modules by displayIndex before rendering
  const sortedModuleGroups = useMemo(() => {
    return Object.values(modules).sort(
      (a, b) => a.module.displayIndex - b.module.displayIndex,
    );
  }, [modules]);

  // Track open/closed state per module to determine "all opened/closed"
  const [moduleOpenState, setModuleOpenState] = useState<
    Record<string, boolean>
  >(() =>
    sortedModuleGroups.reduce((acc, mg) => {
      acc[mg.module.id] = !!expandAll;
      return acc;
    }, {} as Record<string, boolean>),
  );

  // When expandAllCommandId changes or modules change, sync moduleOpenState to reflect expandAll for all modules
  useEffect(() => {
    const newState = sortedModuleGroups.reduce((acc, mg) => {
      acc[mg.module.id] = !!expandAll;
      return acc;
    }, {} as Record<string, boolean>);
    setModuleOpenState(newState);
  }, [sortedModuleGroups, expandAllStamp, expandAll]); // Use stamp so button presses always trigger

  // Report the full per-module open/closed map to parent (for global checks)
  useEffect(() => {
    if (onModuleOpenStateChange) {
      onModuleOpenStateChange(unit.id, moduleOpenState);
    }
  }, [moduleOpenState, onModuleOpenStateChange, unit.id]);

  // Handler to be passed to ModuleSection so manual toggles update moduleOpenState
  const handleModuleToggle = useCallback(
    (moduleId: string, isOpen: boolean) => {
      setModuleOpenState((prev) => {
        const next = { ...prev, [moduleId]: isOpen };
        return next;
      });
    },
    [],
  );

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
        {sortedModuleGroups.map((moduleGroup) => (
          <ModuleSection
            key={moduleGroup.module.id}
            module={moduleGroup.module}
            bookmarks={moduleGroup.bookmarks}
            onBookmarkDeleted={onBookmarkDeleted}
            expandAll={expandAll}
            expandAllStamp={expandAllStamp}
            onToggle={(isOpen: boolean) =>
              handleModuleToggle(moduleGroup.module.id, isOpen)
            } // pass toggle handler
          />
        ))}
      </Box>
    </Box>
  );
};

export default UnitSection;
