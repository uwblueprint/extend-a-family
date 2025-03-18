import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { PersonOutlineOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useUser } from "../../../hooks/useUser";

interface CreateUnitModalProps {
  openCreateUnitModal: boolean;
  handleCloseCreateUnitModal: () => void;
  setCreateUnitName: (value: React.SetStateAction<string>) => void;
  createUnit: () => void;
}

export default function CreateUnitModal(props: CreateUnitModalProps) {
  const {
    openCreateUnitModal,
    handleCloseCreateUnitModal,
    setCreateUnitName,
    createUnit,
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
              marginBottom: "12px",
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
              <TextField
                required
                type="text"
                placeholder="Unit Title"
                onChange={(event) => setCreateUnitName(event.target.value)}
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  height: "56px",
                  width: "100%",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlined />
                    </InputAdornment>
                  ),
                }}
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
            onClick={createUnit}
            disableElevation
          >
            <Typography variant="labelLarge">CREATE</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
