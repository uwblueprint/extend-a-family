import React from "react";
import { Box, Button, Modal, Stack } from "@mui/material";

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
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          height: 200,
          bgcolor: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Stack spacing={2} width="100%">
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            fullWidth
          >
            Delete
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Back
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteBookmarkModal;
