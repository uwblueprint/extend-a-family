import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import WidthWideOutlinedIcon from "@mui/icons-material/WidthWideOutlined";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import { Bookmark } from "../../types/UserTypes";

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const theme = useTheme();
  const isSlide = bookmark.type === "Lesson";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "21.756px 14.504px 14.504px 14.504px",
        gap: "9.065px",
        flex: "1 0 0",
        alignSelf: "stretch",
        borderRadius: "7.252px",
        border: "0.907px solid #D9D9D9",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          display: "flex",
          height: "226.923px",
          minWidth: "250px",
          maxWidth: "400px",
          minHeight: "199.997px",
          maxHeight: "319.994px",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "stretch",
          aspectRatio: "283.66 / 226.92",
          borderRadius: "7.252px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80')", // TEMP
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Type (Slide or Activity) with icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {isSlide ? (
          <WidthWideOutlinedIcon sx={{ width: "14px", height: "14px" }} />
        ) : (
          <PanToolAltOutlinedIcon sx={{ width: "14px", height: "14px" }} />
        )}

        <Typography
          sx={{
            color: theme.palette.Neutral[600],
            font: theme.typography.labelSmall,
          }}
        >
          {isSlide ? "Slide" : bookmark.type}
        </Typography>
      </Box>

      {/* Bookmark Title */}
      <Typography
        sx={{
          color: theme.palette.Neutral[700],
          font: theme.typography.bodyMedium,
        }}
      >
        {bookmark.title}
      </Typography>
    </Box>
  );
};

export default BookmarkItem;
