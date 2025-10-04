import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CreatePasswordHelpConfirmationModal from "./CreatePasswordHelpConfirmationModal";

interface CreatePasswordHelpModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePasswordHelpModal: React.FC<CreatePasswordHelpModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleNext = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="help-modal-title"
        PaperProps={{
          sx: {
            display: "flex",
            width: "600px",
            height: "400px",
            padding: theme.spacing(4),
            flexDirection: "column",
            gap: theme.spacing(2),
            borderRadius: "8px",
            backgroundColor: theme.palette.Neutral[100],
            position: "relative",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            id="help-modal-title"
            variant="headlineMedium"
            sx={{
              color: theme.palette.Neutral[700],
              textAlign: "left",
            }}
          >
            What problem are you facing?
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              display: "flex",
              width: "48px",
              height: "48px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: theme.spacing(1.25),
              borderRadius: "5000px",
              border: `1px solid ${theme.palette.Neutral[500]}`,
              color: "black",
              "&:hover": {
                backgroundColor: theme.palette.Neutral[200],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            alignSelf: "stretch",
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          }}
        >
          <TextField
            fullWidth
            label="What problem are you facing?"
            placeholder="How can we help?"
            variant="outlined"
            multiline
            minRows={5}
            sx={{
              height: "100%",
            }}
            InputProps={{
              sx: {
                borderRadius: "4px",
                alignItems: "flex-start",
                height: "100%",
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: theme.typography.bodyMedium.fontSize,
                fontWeight: 500,
                color: theme.palette.Neutral[700],
                backgroundColor: theme.palette.Neutral[100],
                padding: `0 ${theme.spacing(0.5)}`,
                transform: "translate(14px, 10px) scale(1)",
                "&.Mui-focused": {
                  transform: "translate(14px, -8px) scale(0.75)",
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -8px) scale(0.75)",
                },
              },
            }}
          />
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            variant="text"
            onClick={onClose}
            sx={{
              color: theme.palette.Learner.Dark.Default,
              textAlign: "left",
              fontSize: theme.typography.bodyMedium.fontSize,
              fontWeight: theme.typography.bodySmall.fontWeight,
              lineHeight: theme.typography.bodySmall.lineHeight,
              letterSpacing: 0.625,
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
              minWidth: "auto",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: "transparent",
              },
            }}
          >
            Exit
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{
              display: "flex",
              height: "45px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: theme.spacing(1),
              borderRadius: "8px",
              padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
              textTransform: "uppercase",
              fontSize: theme.typography.labelLarge.fontSize,
              fontStyle: "normal",
              fontWeight: theme.typography.labelLarge.fontWeight,
              lineHeight: theme.typography.labelLarge.lineHeight,
              letterSpacing: theme.typography.labelLarge.letterSpacing,
              color: theme.palette.Neutral[100],
              backgroundColor: theme.palette.Learner.Dark.Default,
              "&:hover": {
                background: theme.palette.Learner.Dark.Pressed,
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Dialog>
      <CreatePasswordHelpConfirmationModal
        open={isConfirmationModalOpen}
        onClose={handleConfirmationClose}
      />
    </>
  );
};

export default CreatePasswordHelpModal;
