import React from "react";
import CloseIcon from "@mui/icons-material/Close";
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
import { PersonOutlineOutlined } from "@mui/icons-material";

interface CreateUnitModalProps {
  openEditUnitModal: boolean;
  setEditUnitName: (value: React.SetStateAction<string>) => void;
  handleCloseEditUnitModal: () => void;
  editUnit: () => void;
}

export default function CreateUnitModal(props: CreateUnitModalProps) {
  const {
    openEditUnitModal,
    setEditUnitName,
    handleCloseEditUnitModal,
    editUnit,
  } = props;

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openEditUnitModal}
        onClose={handleCloseEditUnitModal}
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
              onClick={handleCloseEditUnitModal}
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
                onChange={(event) => setEditUnitName(event.target.value)}
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
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              "&:hover": {
                bgcolor: theme.palette.Administrator.Hover,
              },
              borderColor: `${theme.palette.Light.Outline}`,
            }}
            onClick={handleCloseEditUnitModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette.Administrator.Default}
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
              backgroundColor: theme.palette.Administrator.Default,
              "&:hover": {
                bgcolor: theme.palette.Administrator.Default,
              },
            }}
            onClick={editUnit}
          >
            <Typography variant="labelLarge">SAVE EDIT</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
