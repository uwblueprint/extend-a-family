import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ModeOutlined } from "@mui/icons-material";
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
import { useUser } from "../../../hooks/useUser";
import StartAdornedTextField from "../../common/form/StartAdornedTextField";

interface CreateUnitModalProps {
  openCreateUnitModal: boolean;
  handleCloseCreateUnitModal: () => void;
  createUnit: (title: string) => Promise<void>;
}

export default function CreateUnitModal({
  openCreateUnitModal,
  handleCloseCreateUnitModal,
  createUnit,
}: CreateUnitModalProps) {
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
        open={openCreateUnitModal}
        onClose={handleCloseCreateUnitModal}
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
              onClick={handleCloseCreateUnitModal}
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
              Create a new unit
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
                label="Unit Title"
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
                focusedBorderColor={theme.palette.Administrator.Default}
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
                bgcolor: theme.palette[user.role].Hover,
              },
            }}
            onClick={handleCloseCreateUnitModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Default}
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
              backgroundColor: theme.palette[user.role].Default,
              "&:hover": {
                bgcolor: theme.palette[user.role].Default,
              },
            }}
            onClick={async () => {
              await createUnit(title);
              handleCloseCreateUnitModal();
            }}
            disableElevation
          >
            <Typography variant="labelLarge">CREATE</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
