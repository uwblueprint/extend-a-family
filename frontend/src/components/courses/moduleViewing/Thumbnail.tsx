import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import { padNumber } from "../../../utils/StringUtils";

const ModuleSidebarThumbnail = ({
  index,
  currentPage,
  setCurrentPage,
  thumbnailRefs,
  children,
  isBookmarked,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggable,
  isDragging,
  isDropTarget,
}: {
  index: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  thumbnailRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  children: React.ReactNode;
  isBookmarked?: boolean;
  onContextMenu?: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave?: () => void;
  onDrop?: (index: number) => void;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
}) => {
  const theme = useTheme();

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onContextMenu) {
      event.preventDefault();
      onContextMenu(event, index);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      const { dataTransfer } = event;
      dataTransfer.effectAllowed = "move";
      onDragStart(index);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (onDragOver) {
      event.preventDefault();
      const { dataTransfer } = event;
      dataTransfer.dropEffect = "move";
      onDragOver(event, index);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (onDrop) {
      event.preventDefault();
      onDrop(index);
    }
  };

  return (
    <Box
      key={`thumbnail_${index}`}
      ref={(el: HTMLDivElement | null) => {
        // eslint-disable-next-line no-param-reassign
        if (thumbnailRefs.current) thumbnailRefs.current[index] = el;
      }}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      sx={{
        color:
          index === currentPage ? theme.palette.Learner.Dark.Default : "black",
        cursor: isDraggable ? "grab" : "pointer",
        marginBottom: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyItems: "center",
        flexDirection: "row",
        gap: "8px",
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 0.2s ease",
        position: "relative",
        "&:active": {
          cursor: isDraggable ? "grabbing" : "pointer",
        },
        "&::before": isDropTarget
          ? {
              content: '""',
              position: "absolute",
              top: "-5px",
              left: 0,
              right: 0,
              height: "3px",
              backgroundColor: theme.palette.Learner.Dark.Default,
              borderRadius: "2px",
              zIndex: 10,
            }
          : {},
      }}
      onClick={() => setCurrentPage(index)}
      onContextMenu={handleContextMenu}
    >
      <Box
        sx={{
          color:
            index === currentPage
              ? theme.palette.Learner.Dark.Default
              : "black",
        }}
      >
        <Typography
          variant="labelSmall"
          sx={{
            fontWeight: index === currentPage ? "700" : "300",
            display: "block",
          }}
        >
          {padNumber(index + 1)}
        </Typography>
        {isBookmarked && <BookmarkIcon sx={{ fontSize: "16px" }} />}
      </Box>
      <Box
        sx={{
          position: "relative",
          border:
            currentPage === index
              ? `2px solid ${theme.palette.Learner.Dark.Default}`
              : "none",
          borderRadius: "4px",
          width: "fit-content",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModuleSidebarThumbnail;
