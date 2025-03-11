import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { PersonOutlineOutlined, AlternateEmail } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  handleAddAdmin: () => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  open,
  onClose,
  setFirstName,
  setLastName,
  setEmail,
  handleAddAdmin,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={open}
        onClose={onClose}
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
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 2, right: 2 }}
        >
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
        <Box sx={{ position: "relative", width: "100%" }}>
          <DialogTitle sx={{ margin: 0, padding: 0, marginBottom: "12px" }}>
            <Typography
              variant="headlineMedium"
              color={theme.palette.Neutral[700]}
            >
              Add new admin
            </Typography>
          </DialogTitle>
        </Box>
        <DialogContent sx={{ margin: 0, padding: 0 }}>
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
              placeholder="First Name"
              onChange={(event) => setFirstName(event.target.value)}
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
            <TextField
              required
              type="text"
              placeholder="Last Name"
              onChange={(event) => setLastName(event.target.value)}
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
            <TextField
              required
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "stretch",
                maxHeight: "56px",
                width: "100%",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
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
              "&:hover": { bgcolor: theme.palette.Administrator.Hover },
              borderColor: theme.palette.Light.Outline,
            }}
            onClick={onClose}
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
              "&:hover": { bgcolor: theme.palette.Administrator.Default },
            }}
            onClick={handleAddAdmin}
            disableElevation
          >
            <Typography variant="labelLarge">ADD ADMIN</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddAdminModal;
