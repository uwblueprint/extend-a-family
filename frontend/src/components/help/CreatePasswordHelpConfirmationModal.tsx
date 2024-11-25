import React from "react";
import {
  Dialog,
  Container,
  Typography,
  Button,
  IconButton,
  useTheme,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

interface CreatePasswordHelpConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePasswordHelpConfirmationModal: React.FC<
  CreatePasswordHelpConfirmationModalProps
> = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      PaperProps={{
        sx: {
          display: "flex",
          width: "677px",
          height: "400px",
          padding: "32px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: "var(--Neutral-100, #FFF)",
          position: "relative",
        },
      }}
    >
      {/* Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          top: "32px",
          right: "32px",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid var(--Neutral-500, #6F797B)",
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginTop: "70px",
          width: "536px",
        }}
      >
        <Container
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleIcon
            sx={{
              width: "60px",
              height: "60px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "50%",
            }}
          />
        </Container>

        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            width: "476px",
          }}
        >
          <Typography
            id="confirmation-modal-title"
            sx={{
              color: "var(--Neutral-700, #111)",
              fontFamily: "Lexend Deca",
              fontSize: "26px",
              fontWeight: 600,
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            We have let your facilitator know
          </Typography>
          <Typography
            sx={{
              color: "var(--Neutral-500, #6F797B)",
              fontFamily: "Lexend Deca",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "140%",
              textAlign: "center",
            }}
          >
            They will reach out and help you soon. Hang tight!
          </Typography>
        </Container>
      </Container>

      {/* Done Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // Align to the right
          width: "100%",
          marginTop: "auto",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{
            height: "45px",
            borderRadius: "8px",
            padding: "8px 16px",
            textTransform: "uppercase",
            fontFamily: "Lexend Deca",
            fontSize: "14px",
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
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreatePasswordHelpConfirmationModal;
