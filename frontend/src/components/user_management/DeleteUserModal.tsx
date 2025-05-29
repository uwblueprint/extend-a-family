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
  deleteFirstName: string;
  deleteLastName: string;
  handleDeleteUser: (
    userId: string,
    firstName: string,
    lastName: string,
  ) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  open,
  onClose,
  deleteUserId,
  deleteFirstName,
  deleteLastName,
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
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 2, right: 2 }}
      >
        <CloseIcon sx={{ color: "black" }} />
      </IconButton>
      <Box sx={{ position: "relative", width: "100%" }}>
        <DialogTitle sx={{ margin: 0, padding: 0, marginBottom: "12px" }}>
          <Typography
            variant="headlineMedium"
            color={theme.palette.Neutral[700]}
          >
            Delete User?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ margin: 0, padding: 0 }}>
          <DialogContentText>
            <Typography variant="bodyMedium" color={theme.palette.Neutral[700]}>
              This action can&apos;t be undone. A deleted user cannot be
              recovered.
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
            borderColor: theme.palette.Neutral[500],
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
          onClick={() =>
            handleDeleteUser(deleteUserId, deleteFirstName, deleteLastName)
          }
          disableElevation
        >
          <Typography variant="labelLarge">DELETE</Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteUserModal;
