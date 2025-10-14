import { AlternateEmail, PersonOutlineOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import StartAdornedTextField from "../common/form/StartAdornedTextField";

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  handleAddLearner: () => void;
}

const AddLearnerModal: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  setFirstName,
  setLastName,
  setEmail,
  handleAddLearner,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog open={open} onClose={onClose}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddLearner();
          }}
          style={{
            display: "flex",
            width: "400px",
            padding: "32px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "48px",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 2, right: 2 }}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
          <Box sx={{ position: "relative", width: "100%" }}>
            <DialogTitle sx={{ margin: 0, padding: 0 }}>
              <Typography
                variant="headlineMedium"
                color={theme.palette.Neutral[700]}
              >
                Add New Learner
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
              <StartAdornedTextField
                required
                type="text"
                label="First Name"
                onChange={(event) => setFirstName(event.target.value)}
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  height: "56px",
                  width: "100%",
                }}
                adornment={<PersonOutlineOutlined />}
              />
              <StartAdornedTextField
                required
                type="text"
                label="Last Name"
                onChange={(event) => setLastName(event.target.value)}
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  height: "56px",
                  width: "100%",
                }}
                adornment={<PersonOutlineOutlined />}
              />
              <StartAdornedTextField
                required
                type="email"
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  maxHeight: "56px",
                  width: "100%",
                }}
                adornment={<AlternateEmail />}
              />
            </Box>
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                backgroundColor: theme.palette.Facilitator.Dark.Default,
                "&:hover": { bgcolor: theme.palette.Facilitator.Dark.Hover },
                width: "100%",
              }}
              // onClick={handleAddLearner}
              type="submit"
            >
              <Typography
                variant="labelLarge"
                sx={{
                  color: theme.palette.Neutral[100],
                  textAlign: "center",
                  width: "100%",
                }}
              >
                CREATE ACCOUNT
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                "&:hover": { bgcolor: theme.palette.Facilitator.Light.Hover },
                borderColor: theme.palette.Neutral[500],
                width: "100%",
              }}
              onClick={onClose}
            >
              <Typography
                variant="labelLarge"
                sx={{
                  color: theme.palette.Facilitator.Dark.Default,
                  textAlign: "center",
                }}
              >
                CANCEL
              </Typography>
            </Button>
          </Box>
          <Typography
            variant="bodyMedium"
            sx={{
              color: theme.palette.Neutral[500],
            }}
          >
            Once you create the account, the learner will receive an email with
            a link to activate their account and create a password.
          </Typography>
        </form>
      </Dialog>
    </Box>
  );
};

export default AddLearnerModal;
