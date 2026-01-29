import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { useUser } from "../../../hooks/useUser";
import { useFeedbacks } from "../../../contexts/FeedbacksContext";

interface DeleteModuleModalProps {
  openDeleteModuleModal: boolean;
  handleCloseDeleteModuleModal: () => void;
  deleteModule: () => Promise<void>;
}

export default function DeleteModuleModal(props: DeleteModuleModalProps) {
  const { openDeleteModuleModal, handleCloseDeleteModuleModal, deleteModule } =
    props;

  const theme = useTheme();
  const user = useUser();

  const { exportFeedbackToTSV } = useFeedbacks();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openDeleteModuleModal}
        onClose={handleCloseDeleteModuleModal}
        PaperProps={{
          sx: {
            display: "flex",
            width: "400px",
            padding: "32px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "32px",
          },
        }}
      >
        <Box>
          <Box>
            <IconButton
              onClick={handleCloseDeleteModuleModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle
            sx={{
              margin: "0px",
              padding: "0px",
              marginBottom: "12px",
            }}
          >
            <Typography
              variant="headlineMedium"
              color={theme.palette.Neutral[700]}
            >
              Delete Module?
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "0px",
              padding: "0px",
              gap: "32px",
            }}
          >
            <DialogContentText>
              <Typography
                variant="bodyMedium"
                color={theme.palette.Neutral[700]}
              >
                This action can&apos;t be undone. A deleted module cannot be
                recovered.
              </Typography>
            </DialogContentText>
            <Box
              sx={{
                display: "flex",
                padding: "16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
                borderRadius: "8px",
                backgroundColor: theme.palette.Administrator.Light.Default,
              }}
            >
              <Typography variant="bodyMedium">
                Save a copy of the learner feedback before deleting:
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "36px",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.Administrator.Dark.Default,
                  borderColor: theme.palette.Administrator.Dark.Default,
                  color: "white",
                }}
                disableElevation
                onClick={exportFeedbackToTSV}
              >
                <Typography variant="labelLarge">
                  Download Feedback (TSV)
                </Typography>
              </Button>
            </Box>
          </DialogContent>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            disableElevation
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              "&:hover": {
                bgcolor: theme.palette[user.role].Light.Hover,
              },
            }}
            onClick={handleCloseDeleteModuleModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Dark.Default}
            >
              Go Back
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              backgroundColor: theme.palette.Error.Dark.Default,
              "&:hover": {
                bgcolor: theme.palette.Error.Dark.Default,
              },
            }}
            onClick={async () => {
              await deleteModule();
              handleCloseDeleteModuleModal();
            }}
            disableElevation
          >
            <Typography variant="labelLarge">Delete</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
