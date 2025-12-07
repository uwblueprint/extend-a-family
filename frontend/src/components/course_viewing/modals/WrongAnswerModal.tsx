import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

export type WrongAnswerModalProps = {
  open: boolean;
  onClose: () => void;
  hint?: string;
};

const WrongAnswerModal: React.FC<WrongAnswerModalProps> = ({
  open,
  onClose,
  hint,
}) => {
  const theme = useTheme();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          display: "flex",
          width: "372px",
          minWidth: "280px",
          maxWidth: "560px",
          padding: "24px",
          flexDirection: "column",
          gap: "16px",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.Neutral[400]}`,
          background: theme.palette.Neutral[100],
          overflow: "hidden",
        },
      }}
    >
      <Typography
        variant="headlineSmall"
        color={theme.palette.Neutral[700]}
        sx={{ textAlign: "left" }}
      >
        Oops! Try again.
      </Typography>

      <DialogContent
        sx={{
          padding: 0,
          width: "100%",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Typography variant="bodyMedium">
          Choose 1 from the list below + “Click the button below to try again”
        </Typography>
        {hint && <Typography variant="bodyMedium">Hint: {hint}</Typography>}
        <Button
          sx={{
            height: "40px",
            padding: "10px 16px 10px 24px",
            gap: "8px",
            border: "1px solid",
            borderColor: theme.palette.Neutral[500],
            borderRadius: "4px",
            backgroundColor: theme.palette.Learner.Dark.Default,
            color: "white",
            alignSelf: "flex-end",
          }}
          onClick={onClose}
        >
          <Typography variant="labelLarge">Try Again</Typography>
          <RefreshIcon />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WrongAnswerModal;
