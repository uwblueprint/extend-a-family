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
            padding: "32px",
            flexDirection: "column",
            gap: "16px",
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
                paddingTop: "8px",
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--Neutral-700, #111)",
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
              fontSize: theme.typography.bodySmall?.fontSize,
              fontWeight: theme.typography.bodySmall?.fontWeight,
              lineHeight: theme.typography.bodySmall?.lineHeight,
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
              gap: "8px",
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "uppercase",
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              letterSpacing: "0.7px",
              color: "white",
              backgroundColor: theme.palette.learner.main,
              "&:hover": {
                backgroundColor: theme.palette.learner.main,
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
