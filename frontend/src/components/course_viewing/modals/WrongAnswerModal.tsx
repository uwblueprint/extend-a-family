import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import activityWrongAnswerTitles from "../../../constants/ActivityWrongAnswerTitles";

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
  const [lastUpdated, setLastUpdated] = React.useState(Date.now());
  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (!prevOpen.current && open) {
      setLastUpdated(Date.now());
    }
    prevOpen.current = open;
  }, [open]);

  const title = useMemo(
    () =>
      hint
        ? "Hint"
        : activityWrongAnswerTitles[
            Math.floor(Math.random() * activityWrongAnswerTitles.length)
          ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hint, lastUpdated],
  );

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
        {title}
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
          {hint || "Click the button below to try again"}
        </Typography>
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
          onClick={handleClose}
        >
          <Typography variant="labelLarge">Try Again</Typography>
          <RefreshIcon />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WrongAnswerModal;
