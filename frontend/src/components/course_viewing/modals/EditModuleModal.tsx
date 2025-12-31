import { ModeOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../../hooks/useUser";
import StartAdornedTextField from "../../common/form/StartAdornedTextField";

interface EditModuleModalProps {
  openEditModuleModal: boolean;
  handleCloseEditModuleModal: () => void;
  editModule: (title: string) => Promise<void>;
  currentTitle: string;
}

export default function EditModuleModal({
  openEditModuleModal,
  handleCloseEditModuleModal,
  editModule,
  currentTitle,
}: EditModuleModalProps) {
  const [title, setTitle] = useState("");
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
        open={openEditModuleModal}
        onClose={handleCloseEditModuleModal}
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
              onClick={handleCloseEditModuleModal}
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
            }}
          >
            <Typography
              variant="headlineMedium"
              color={theme.palette.Neutral[700]}
            >
              Edit module
            </Typography>
          </DialogTitle>
        </Box>
        <Box>
          <DialogContent
            sx={{
              margin: "0px",
              padding: "0px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "336px",
                gap: "24px",
              }}
            >
              <StartAdornedTextField
                required
                type="text"
                label="Module Title"
                defaultValue={currentTitle}
                onChange={(event) => setTitle(event.target.value)}
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  height: "56px",
                  width: "100%",
                }}
                adornment={<ModeOutlined />}
                focusedBorderColor={theme.palette.Administrator.Dark.Default}
              />
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
            onClick={handleCloseEditModuleModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Dark.Default}
            >
              CANCEL
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              backgroundColor: theme.palette[user.role].Dark.Default,
              "&:hover": {
                bgcolor: theme.palette[user.role].Dark.Default,
              },
            }}
            onClick={async () => {
              await editModule(title);
              handleCloseEditModuleModal();
            }}
            disableElevation
          >
            <Typography variant="labelLarge">SAVE EDIT</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
