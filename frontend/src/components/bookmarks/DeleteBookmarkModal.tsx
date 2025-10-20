import React from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteBookmarkModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteBookmarkModal: React.FC<DeleteBookmarkModalProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  const theme = useTheme();

  const commonButtonStyles = {
    display: "flex",
    height: "40px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    textTransform: "none",
    font: theme.typography.labelMedium,
    lineHeight: "normal",

    "& .MuiButton-startIcon": {
      marginRight: "8px",
      marginLeft: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      top: "0.5px",
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-bookmark-title"
      aria-describedby="delete-bookmark-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          width: "400px",
          padding: "32px",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "32px",
          borderRadius: "8px",
          border: "1px solid #B2B3B5",
          background: "#FFF",
          boxShadow: 24,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            color: "#555759",
          }}
          aria-label="Close modal"
        >
          <CloseIcon />
        </IconButton>

        {/* Title and Subtext */}
        <Box>
          <Typography
            id="delete-bookmark-title"
            sx={{
              color: "#555759",
              font: theme.typography.headlineMedium,
              marginBottom: "12px",
            }}
          >
            Delete bookmark?
          </Typography>
          <Typography
            id="delete-bookmark-description"
            sx={{
              color: "#555759",
              font: theme.typography.bodyMedium,
            }}
          >
            Are you sure you want to delete this bookmark? This action can’t be undone.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack
          direction="row"
          sx={{
            alignSelf: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <ArrowBackIosNewIcon
                sx={{ width: "18px", height: "18px", color: "#006C7D" }}
              />
            }
            onClick={onClose}
            sx={{
              ...commonButtonStyles,
              width: "134px",
              color: "#006C7D",
              borderColor: "#B2B3B5",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.03)",
                borderColor: "#9b9c9e",
              },
            }}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            startIcon={
              <DeleteOutlineIcon sx={{ width: "18px", height: "18px" }} />
            }
            onClick={onDelete}
            sx={{
              ...commonButtonStyles,
              width: "121px",
              backgroundColor: "#AD2323",
              color: "#FFF",
              "&:hover": {
                backgroundColor: "#911C1C",
              },
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteBookmarkModal;
