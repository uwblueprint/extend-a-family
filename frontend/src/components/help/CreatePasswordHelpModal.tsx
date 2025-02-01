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
            padding: "32px",
            flexDirection: "column",
            gap: "16px",
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
            sx={{
              color: theme.palette.Neutral[700],
              textAlign: "left",
              fontFamily: "Lexend Deca",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "120%",
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
              gap: "10px",
              borderRadius: "5000px",
              border: "1px solid var(--Neutral-500, #6F797B)",
              color: "black",
              "&:hover": {
                backgroundColor: "#f0f0f0",
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
                fontSize: "16px",
                fontWeight: 500,
                color: "var(--Neutral-700, #111)",
                backgroundColor: "#FFF",
                padding: "0 4px",
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
              color: theme.palette.Learner.Default,
              textAlign: "left",
              fontSize: theme.typography.bodyMedium?.fontSize,
              fontWeight: theme.typography.bodySmall?.fontWeight,
              lineHeight: theme.typography.bodySmall?.lineHeight,
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
              gap: "8px",
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "uppercase",
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: theme.typography.labelLarge,
              lineHeight: theme.typography.labelLarge,
              letterSpacing: theme.typography.labelLarge,
              color: "white",
              backgroundColor: theme.palette.Learner.Default,
              "&:hover": {
                background: "var(--Learner-Hover, #005566)",
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