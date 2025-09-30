import React from "react";
import { Box } from "@mui/material";
import BookmarkItem from "./BookmarkItem";

interface ModuleBookmarksGridProps {
  bookmarks: Array<{
    id: string;
    title: string;
    type: string;
    unitId: string;
    moduleId: string;
    pageId: string;
  }>;
}

const ModuleBookmarksGrid: React.FC<ModuleBookmarksGridProps> = ({ bookmarks }) => {
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
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </Box>
  );
};

export default ModuleBookmarksGrid;
