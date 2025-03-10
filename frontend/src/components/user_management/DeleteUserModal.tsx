import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  deleteUserId: string;
  handleDeleteUser: (userId: string) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  open,
  onClose,
  deleteUserId,
  handleDeleteUser,
}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          display: "flex",
          width: "400px",
          padding: "32px",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "32px",
        },
      }}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ margin: 0, padding: 0, marginBottom: "12px" }}>
          <Typography
            variant="headlineMedium"
            color={theme.palette.OnBackground}
          >
            Delete User?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ margin: 0, padding: 0 }}>
          <DialogContentText>
            <Typography variant="bodyMedium" color={theme.palette.OnBackground}>
              This action can&apos;t be undone. A deleted user cannot be
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            display: "flex",
            height: "40px",
            gap: "8px",
            "&:hover": { bgcolor: theme.palette.Administrator.Hover },
            borderColor: theme.palette.Light.Outline,
          }}
          onClick={onClose}
        >
          <Typography
            variant="labelLarge"
            color={theme.palette.Administrator.Default}
          >
            GO BACK
          </Typography>
        </Button>
        <Button
          variant="contained"
          sx={{
            display: "flex",
            height: "40px",
            gap: "8px",
            backgroundColor: theme.palette.Error.Default,
            "&:hover": { bgcolor: theme.palette.Error.Default },
          }}
          onClick={() => handleDeleteUser(deleteUserId)}
        >
          <Typography variant="labelLarge">DELETE</Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteUserModal;
