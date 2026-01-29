import { Box } from "@mui/material";
import React from "react";
import { CourseModule } from "../../types/CourseTypes";
import BookmarkItem from "./BookmarkItem";

interface ModuleBookmarksGridProps {
  module: CourseModule;
  bookmarks: Array<{
    id: string;
    title: string;
    type: string;
    unitId: string;
    moduleId: string;
    pageId: string;
  }>;
  onBookmarkDeleted?: (pageId: string) => void;
}

const ModuleBookmarksGrid: React.FC<ModuleBookmarksGridProps> = ({
  module,
  bookmarks,
  onBookmarkDeleted,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: "16px",
      }}
    >
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          module={module}
          bookmark={bookmark}
          onDeleteSuccess={onBookmarkDeleted}
        />
      ))}
    </Box>
  );
};

export default ModuleBookmarksGrid;
