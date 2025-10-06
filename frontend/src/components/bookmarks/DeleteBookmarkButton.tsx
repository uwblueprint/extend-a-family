import React from "react";
import { Box } from "@mui/material";
import BookmarkRemoveOutlinedIcon from "@mui/icons-material/BookmarkRemoveOutlined";

interface DeleteBookmarkButtonProps {
  onClick?: (e: React.MouseEvent) => void;
}

const DeleteBookmarkButton: React.FC<DeleteBookmarkButtonProps> = ({ onClick }) => {
  return (
    <Box
      className="delete-btn"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "36px",
        height: "36px",
        borderRadius: "100px",
        background: "#FFF",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        transition:
          "opacity 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        cursor: "pointer",
        "&:hover": {
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #FFF",
        },
        "&:active": {
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #FFF",
        },
      }}
    >
      <BookmarkRemoveOutlinedIcon
        sx={{
          width: "20px",
          height: "20px",
          color: "black",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default DeleteBookmarkButton;
