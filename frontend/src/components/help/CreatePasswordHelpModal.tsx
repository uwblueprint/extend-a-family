import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";

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
    setConfirmationModalOpen(true); // Open the second modal
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false); // Close the second modal
    onClose(); // Optionally close the first modal after confirmation
  };

  return (
    <>
      {/* First Modal */}
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
            backgroundColor: "var(--Neutral-100, #FFF)",
            position: "relative",
          },
        }}
      >
        {/* Title and Close Button */}
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
            sx={{
              color: "var(--Neutral-700, #111)",
              textAlign: "left",
              fontSize: theme.typography.headlineMedium.fontSize,
              fontStyle: "normal",
              fontWeight: theme.typography.headlineMedium.fontWeight,
              lineHeight: theme.typography.headlineMedium.lineHeight,
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

        {/* Content */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            alignSelf: "stretch",
            gap: "16px",
            paddingLeft: 0,
            paddingRight: 0,
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
                padding: "12px",
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

        {/* Bottom Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="bodySmall"
            sx={{
              color: theme.palette.learner.main,
              textAlign: "left",
              fontSize: theme.typography.bodyMedium.fontSize,
              fontWeight: theme.typography.bodySmall.fontWeight,
              lineHeight: theme.typography.bodySmall.lineHeight,
              letterSpacing: 0.625,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Exit
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext} // Open the second modal
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
              backgroundColor: theme.palette.Learner.Default,
              "&:hover": {
                background: "var(--Learner-Hover, #005566)",  // make theme.ts variables for button hover values
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Dialog>

      {/* Second Modal */}
      <CreatePasswordHelpConfirmationModal
        open={isConfirmationModalOpen}
        onClose={handleConfirmationClose}
      />
    </>
  );
};

export default CreatePasswordHelpModal;
