import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useUser } from "../../../hooks/useUser";

interface DeleteUnitModalProps {
  openDeleteUnitModal: boolean;
  handleCloseDeleteUnitModal: () => void;
  deleteUnit: () => void;
}

export default function CreateUnitModal(props: DeleteUnitModalProps) {
  const { openDeleteUnitModal, handleCloseDeleteUnitModal, deleteUnit } = props;

  const theme = useTheme();
  const user = useUser();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openDeleteUnitModal}
        onClose={handleCloseDeleteUnitModal}
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
        <Box>
          <Box>
            <IconButton
              onClick={handleCloseDeleteUnitModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle
            sx={{
              margin: "0px",
              padding: "0px",
              marginBottom: "12px",
            }}
          >
            <Typography
              variant="headlineMedium"
              color={theme.palette.Neutral[700]}
            >
              Delete Unit?
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              margin: "0px",
              padding: "0px",
            }}
          >
            <DialogContentText>
              <Typography
                variant="bodyMedium"
                color={theme.palette.Neutral[700]}
              >
                This action can&apos;t be undone. A deleted unit cannot be
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
            disableElevation
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              "&:hover": {
                bgcolor: theme.palette[user.role].Hover,
              },
            }}
            onClick={handleCloseDeleteUnitModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Default}
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
              "&:hover": {
                bgcolor: theme.palette.Error.Default,
              },
            }}
            onClick={() => deleteUnit()}
            disableElevation
          >
            <Typography variant="labelLarge">DELETE</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
