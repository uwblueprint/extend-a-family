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

interface CreateUnitModalProps {
  openUnpublishUnitModal: boolean;
  handleCloseUnpublishUnitModal: () => void;
  unpublishUnit: () => void;
}

export default function CreateUnitModal(props: CreateUnitModalProps) {
  const {
    openUnpublishUnitModal,
    handleCloseUnpublishUnitModal,
    unpublishUnit,
  } = props;

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openUnpublishUnitModal}
        onClose={handleCloseUnpublishUnitModal}
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
              onClick={handleCloseUnpublishUnitModal}
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
              Unpublish Unit?
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
                Learners will not be able see the unit until you choose to
                publish it again. This action can be redone.
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
              "&:hover": {
                bgcolor: theme.palette.Administrator.Hover,
              },
              borderColor: `${theme.palette.Light.Outline}`,
            }}
            onClick={handleCloseUnpublishUnitModal}
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
              backgroundColor: theme.palette.Administrator.Default,
              "&:hover": {
                bgcolor: theme.palette.Administrator.Default,
              },
            }}
            onClick={() => unpublishUnit()}
            disableElevation
          >
            <Typography variant="labelLarge">UNPUBLISH</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
