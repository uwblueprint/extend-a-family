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

interface EditPublishedModuleModalProps {
  openEditPublishedModuleModal: boolean;
  handleCloseEditPublishedModuleModal: () => void;
  unpublishModuleAndEdit: () => Promise<void>;
}

export default function EditPublishedModuleModal(
  props: EditPublishedModuleModalProps,
) {
  const {
    openEditPublishedModuleModal,
    handleCloseEditPublishedModuleModal,
    unpublishModuleAndEdit,
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
        open={openEditPublishedModuleModal}
        onClose={handleCloseEditPublishedModuleModal}
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
              onClick={handleCloseEditPublishedModuleModal}
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
              Cannot edit a published module
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
                Unfortunately, you cannot edit a module while it is live. Please
                unpublish it before making changes. Once you’re done, you can
                republish the module.
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
            onClick={handleCloseEditPublishedModuleModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Dark.Default}
            >
              Cancel
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
              await unpublishModuleAndEdit();
              handleCloseEditPublishedModuleModal();
            }}
            disableElevation
          >
            <Typography variant="labelLarge">Unpublish Module</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
