import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import * as Routes from "../../constants/Routes";

interface ModuleLockedModalProps {
  open: boolean;
  onClose: () => void;
  editorName: string;
  unitId?: string;
}

const ModuleLockedModal = ({
  open,
  onClose,
  editorName,
  unitId,
}: ModuleLockedModalProps) => {
  const theme = useTheme();

  const handleBackToCourse = () => {
    if (unitId) {
      window.location.href = `${Routes.COURSE_PAGE}?unitId=${unitId}`;
    } else {
      window.location.href = Routes.COURSE_PAGE;
    }
    onClose();
  };

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
      aria-labelledby="module-locked-title"
      aria-describedby="module-locked-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          width: "450px",
          padding: "32px",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "32px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: theme.palette.Neutral[400],
          background: "#FFF",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <LockIcon
              sx={{
                color: theme.palette.Warning.Dark.Default,
                fontSize: "32px",
              }}
            />
            <Typography
              id="module-locked-title"
              variant="headlineMedium"
              sx={{ color: theme.palette.Neutral[900] }}
            >
              Module Currently Being Edited
            </Typography>
          </Box>
          <Typography
            id="module-locked-description"
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[700] }}
          >
            <strong>{editorName}</strong> is currently editing this module. Only
            one administrator can edit a module at a time to prevent conflicts.
            Please try again later or contact {editorName} directly.
          </Typography>
        </Stack>

        <Stack direction="row" sx={{ alignSelf: "flex-end", gap: "12px" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              ...commonButtonStyles,
              color: theme.palette.Neutral[600],
              border: `1px solid ${theme.palette.Neutral[400]}`,
              "&:hover": {
                border: `1px solid ${theme.palette.Neutral[400]}`,
                backgroundColor: theme.palette.Neutral[200],
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleBackToCourse}
            sx={{
              ...commonButtonStyles,
              color: "#FFF",
              backgroundColor: theme.palette.Administrator.Dark.Default,
              "&:hover": {
                backgroundColor: theme.palette.Administrator.Dark.Hover,
              },
            }}
          >
            Back to Course
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModuleLockedModal;
