import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Bookmark } from "../../types/UserTypes";

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: theme.palette.Neutral[100],
        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[300]}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Typography
        variant="bodyMedium"
        sx={{
          color: theme.palette.Neutral[700],
          fontWeight: 500,
          marginBottom: "8px",
          display: "block",
        }}
      >
        {bookmark.title}
      </Typography>
      <Typography
        variant="bodySmall"
        sx={{
          color: theme.palette.Neutral[500],
          fontStyle: "italic",
          display: "block",
        }}
      >
        Type: {bookmark.type}
      </Typography>
    </Box>
  );
};

export default BookmarkItem;
