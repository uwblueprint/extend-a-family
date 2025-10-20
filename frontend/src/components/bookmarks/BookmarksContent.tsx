import React from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { CourseUnit, CourseModule } from "../../types/CourseTypes";
import UnitSection from "./UnitSection";

interface BookmarksContentProps {
  filteredBookmarks: {
    [unitId: string]: {
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
    };
  };
  loading: boolean;
  error: string | null;
  hasBookmarks: boolean;
  selectedUnitId: string | null;
  onBookmarkDeleted?: (pageId: string) => void;
}

const BookmarksContent: React.FC<BookmarksContentProps> = ({
  filteredBookmarks,
  loading,
  error,
  hasBookmarks,
  selectedUnitId,
  onBookmarkDeleted,
}) => {
  const theme = useTheme();

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

  if (!hasBookmarks) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="bodyLarge" color={theme.palette.Neutral[500]}>
          No bookmarks found. Start bookmarking pages while viewing modules!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Unit Sections */}
      {Object.values(filteredBookmarks).map((unitGroup) => (
        <UnitSection
          key={unitGroup.unit.id}
          unit={unitGroup.unit}
          modules={unitGroup.modules}
          onBookmarkDeleted={onBookmarkDeleted}
        />
      ))}
    </Box>
  );
};

export default BookmarksContent;
