import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import WidthWideOutlinedIcon from "@mui/icons-material/WidthWideOutlined";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import { Link as RouterLink } from "react-router-dom";
import { Bookmark } from "../../types/UserTypes";
import { buildViewPageUrl } from "../../utils/routeBuilders";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import DeleteBookmarkModal from "./DeleteBookmarkModal";
import UserAPIClient from "../../APIClients/UserAPIClient";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDeleteSuccess?: (pageId: string) => void; // optional callback to refresh UI
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  onDeleteSuccess,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const isSlide = bookmark.type === "Lesson";
  const to = buildViewPageUrl({
    unitId: bookmark.unitId,
    moduleId: bookmark.moduleId,
    pageId: bookmark.pageId,
  });

  const handleDelete = async () => {
    try {
      await UserAPIClient.deleteBookmark(bookmark.pageId);
      setOpen(false);
      if (onDeleteSuccess) onDeleteSuccess(bookmark.pageId);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
      alert("Something went wrong while deleting the bookmark.");
    }
  };

  return (
    <>
      <Box
        component={RouterLink}
        to={to}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "21.756px 14.504px 14.504px 14.504px",
          gap: "9.065px",
          borderRadius: "7.252px",
          border: "0.907px solid",
          borderColor: "#D9D9D9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease-in-out",
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transform: "translateY(-1px)",
          },
          "&:hover .delete-btn": {
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto",
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            aspectRatio: "283.66 / 226.92",
            borderRadius: "7.252px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80')", // TEMP
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          {/* Delete button */}
          <DeleteBookmarkButton
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          />
        </Box>

        {/* Type (Slide or Activity) with icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
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

        {/* Title */}
        <Typography
          sx={{
            color: theme.palette.Neutral[700],
            font: theme.typography.bodyMedium,
          }}
        >
          {bookmark.title}
        </Typography>
      </Box>

      {/* Delete confirmation modal */}
      <DeleteBookmarkModal
        open={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default BookmarkItem;
