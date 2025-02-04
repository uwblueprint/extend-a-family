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
          padding: theme.spacing(4),
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: theme.palette.Neutral[100],
          position: "relative",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          top: theme.spacing(4),
          right: theme.spacing(4),
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
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

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme.spacing(2.5),
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
              color: theme.palette.Neutral[100],
              borderRadius: "50%",
            }}
          />
        </Container>

        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing(0.5),
            width: "476px",
          }}
        >
          <Typography
            id="confirmation-modal-title"
            sx={{
              color: theme.palette.Neutral[700],
              fontSize: theme.typography.headlineMedium.fontSize,
              fontWeight: theme.typography.headlineMedium.fontWeight,
              lineHeight: theme.typography.headlineMedium.lineHeight,
              textAlign: "center",
            }}
          >
            We have let your facilitator know
          </Typography>
          <Typography
            sx={{
              color: theme.palette.Neutral[500],
              fontSize: theme.typography.bodyLarge.fontSize,
              fontWeight: theme.typography.bodyLarge.fontWeight,
              lineHeight: theme.typography.bodyLarge.lineHeight,
              textAlign: "center",
            }}
          >
            They will reach out and help you soon. Hang tight!
          </Typography>
        </Container>
      </Container>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
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
            padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            textTransform: "uppercase",
            fontSize: theme.typography.labelLarge.fontSize,
            fontWeight: theme.typography.labelLarge.fontWeight,
            lineHeight: theme.typography.labelLarge.lineHeight,
            letterSpacing: theme.typography.labelLarge.letterSpacing,
            color: theme.palette.Neutral[100],
            backgroundColor: theme.palette.Learner.Default,
            "&:hover": {
              background: theme.palette.Learner.Hover,
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
