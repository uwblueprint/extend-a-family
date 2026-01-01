import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import WidthWideOutlinedIcon from "@mui/icons-material/WidthWideOutlined";
import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { Document, Thumbnail } from "react-pdf";
import { Link as RouterLink } from "react-router-dom";
import UserAPIClient from "../../APIClients/UserAPIClient";
import {
  CourseModule,
  isActivityPage,
  isLessonPage,
} from "../../types/CourseTypes";
import { Bookmark } from "../../types/UserTypes";
import { buildViewPageUrl } from "../../utils/routeBuilders";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import DeleteBookmarkModal from "./DeleteBookmarkModal";

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
      /* eslint-disable-next-line no-console */
      console.error("Failed to delete bookmark:", error);
      /* eslint-disable-next-line no-alert */
      alert("Failed to delete bookmark");
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
            pointerEvents: "none",
            alignItems: "center",
            justifyContent: "center",
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
                width: "100%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
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
              <Document
                file={page.pdfUrl}
                loading={
                  <Typography variant="bodyMedium">Loading...</Typography>
                }
              >
                <Thumbnail
                  pageNumber={page.pageIndex}
                  width={283}
                  scale={1.66}
                />
              </Document>
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
