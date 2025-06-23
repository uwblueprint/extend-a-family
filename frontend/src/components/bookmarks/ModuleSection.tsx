import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { CourseModule } from "../../types/CourseTypes";
import BookmarkItem from "./BookmarkItem";

interface ModuleSectionProps {
  module: CourseModule;
  bookmarks: Array<{
    id: string;
    title: string;
    type: string;
    unitId: string;
    moduleId: string;
    pageId: string;
  }>;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({ module, bookmarks }) => {
  const theme = useTheme();

  return (
    <Box sx={{ marginLeft: "40px", marginBottom: "60px" }}>
      {/* Module Header */}
      <Typography
        variant="titleMedium"
        sx={{
          marginBottom: "32px",
          color: theme.palette.Neutral[600],
          fontWeight: 600,
          paddingLeft: "12px",
          borderLeft: `4px solid ${theme.palette.Neutral[400]}`,
        }}
      >
        Module {module.displayIndex}: {module.title}
      </Typography>

      {/* Bookmarks List */}
      <Box sx={{ marginLeft: "40px" }}>
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </Box>
    </Box>
  );
};

export default ModuleSection;
