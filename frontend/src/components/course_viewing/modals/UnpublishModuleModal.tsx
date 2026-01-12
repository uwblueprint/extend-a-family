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
import { useUser } from "../../../hooks/useUser";

interface UnpublishModuleModalProps {
  openUnpublishModuleModal: boolean;
  handleCloseUnpublishModuleModal: () => void;
  unpublishModule: () => Promise<void>;
}

export default function UnpublishModuleModal(props: UnpublishModuleModalProps) {
  const {
    openUnpublishModuleModal,
    handleCloseUnpublishModuleModal,
    unpublishModule,
  } = props;

  const theme = useTheme();
  const user = useUser();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openUnpublishModuleModal}
        onClose={handleCloseUnpublishModuleModal}
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
              onClick={handleCloseUnpublishModuleModal}
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
              Unpublish Module?
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              margin: "0px",
              padding: "0px",
            }}
          >
            <DialogContentText>
              <Typography
                variant="bodyMedium"
                color={theme.palette.Neutral[700]}
              >
                Learners will not be able see the module until you choose to
                publish it again. This action can be redone.
              </Typography>
            </DialogContentText>
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
            onClick={handleCloseUnpublishModuleModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Dark.Default}
            >
              GO BACK
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
              await unpublishModule();
              handleCloseUnpublishModuleModal();
            }}
            disableElevation
          >
            <Typography variant="labelLarge">Unpublish</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
