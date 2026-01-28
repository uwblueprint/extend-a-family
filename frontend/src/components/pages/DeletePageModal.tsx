import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface DeletePageModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

const DeletePageModal = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: DeletePageModalProps) => {
  const theme = useTheme();

  const commonButtonStyles = {
    display: "flex",
    height: "40px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    textTransform: "none",
    font: theme.typography.labelMedium,
    lineHeight: "normal",
  } as const;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-page-title"
      aria-describedby="delete-page-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          width: "400px",
          padding: "32px",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "32px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: theme.palette.Neutral[400],
          background: theme.palette.Error.Light.Default,
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            color: theme.palette.Neutral[700],
          }}
          aria-label="Close modal"
        >
          <CloseIcon />
        </IconButton>

        <Stack direction="column" alignItems="flex-start" gap="16px">
          <Typography
            id="delete-page-title"
            variant="headlineMedium"
            sx={{ color: theme.palette.Error.Dark.Default }}
          >
            Delete page?
          </Typography>
          <Typography id="delete-page-description" variant="bodyMedium">
            All contents within this page will be deleted. This action can’t be
            undone.
          </Typography>
        </Stack>

        <Stack direction="row" sx={{ alignSelf: "flex-end", gap: "12px" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{
              ...commonButtonStyles,
              color: theme.palette.Neutral[600],
              borderColor: theme.palette.Neutral[400],
              backgroundColor: "white",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              <DeleteOutlineIcon sx={{ width: "18px", height: "18px" }} />
            }
            onClick={onConfirm}
            disabled={isLoading}
            sx={{
              ...commonButtonStyles,
              backgroundColor: theme.palette.Error.Dark.Default,
              color: "#FFF",
              "&:hover": {
                backgroundColor: theme.palette.Error.Dark.Hover,
              },
              "&:active": {
                backgroundColor: theme.palette.Error.Dark.Pressed,
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            {isLoading ? "Deleting..." : "Yes, delete page"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeletePageModal;
