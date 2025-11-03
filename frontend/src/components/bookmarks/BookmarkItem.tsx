import React, { useState } from "react";
import { Thumbnail } from "react-pdf";
import { Box, Typography, useTheme } from "@mui/material";
import WidthWideOutlinedIcon from "@mui/icons-material/WidthWideOutlined";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import { Link as RouterLink } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Bookmark } from "../../types/UserTypes";
import {
  CourseModule,
  isActivityPage,
  isLessonPage,
} from "../../types/CourseTypes";
import { buildViewPageUrl } from "../../utils/routeBuilders";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import DeleteBookmarkModal from "./DeleteBookmarkModal";
import UserAPIClient from "../../APIClients/UserAPIClient";

interface BookmarkItemProps {
  module: CourseModule;
  bookmark: Bookmark;
  onDeleteSuccess?: (pageId: string) => void; // optional callback to refresh UI
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  module,
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

  const page = module.pages.find((p) => p.id === bookmark.pageId);

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
        {/* Thumbnail */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            aspectRatio: "283.66 / 226.92",
            borderRadius: "7.252px",
            overflow: "hidden",
            backgroundColor: theme.palette.Neutral[200],
          }}
        >
          {page && isActivityPage(page) && (
            <PlayCircleOutlineIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "60px",
                zIndex: 1,
                color: theme.palette.Neutral[500],
              }}
            />
          )}
          {page && isLessonPage(page) && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                "& .react-pdf__Page": {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                  height: "100%",
                },
                "& .react-pdf__Page__canvas": {
                  width: "100% !important",
                  height: "100% !important",
                  display: "block",
                },
              }}
            >
              <Thumbnail pageNumber={page.pageIndex} width={283} scale={1.66} />
            </Box>
          )}
          {page && isActivityPage(page) && (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: theme.palette.Neutral[200],
              }}
            />
          )}
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
