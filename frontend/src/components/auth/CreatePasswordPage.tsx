import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
} from "@mui/material";

import PasswordIcon from "@mui/icons-material/Password";
import Logo from "../images/logo.svg";

import CreatePasswordHelpModal from "../help/CreatePasswordHelpModal";
import CreatePasswordConfirmationPage from "./CreatePasswordConfirmationPage";

const CreatePasswordPage = (): React.ReactElement => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const theme = useTheme();

  const onSubmitNewPasswordClick = () => {
    if (newPassword === confirmPassword) {
      setIsPasswordConfirmed(true);
    } else {
      alert("Passwords do not match.");
    }
  };

  const handleOpenHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  // Conditional rendering based on password confirmation
  if (isPasswordConfirmed) {
    return <CreatePasswordConfirmationPage />;
  }

  return (
    <Container
      sx={{
        display: "flex",
        width: "1440px",
        padding: "61px 470px 0px 470px",
        flexDirection: "column",
        alignItems: "center",
        gap: "100px",
      }}
    >
      <Box
        component="img"
        src={Logo}
        sx={{
          width: "125.874px",
          height: "60px",
        }}
      />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            width: "500px",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <Typography
            variant="headlineLarge"
            gutterBottom
            sx={{
              fontSize: theme.typography.headlineMedium?.fontSize,
              fontWeight: theme.typography.headlineLarge?.fontWeight,
              lineHeight: theme.typography.headlineLarge?.lineHeight,
              color: "#000",
              textAlign: "center",
            }}
          >
            Create Password
          </Typography>
          <form>
            <Container
              sx={{
                alignItems: "center",
              }}
            >
              <TextField
                label="New password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                placeholder="Your new password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    fontSize: theme.typography.bodyLarge?.fontSize,
                    fontWeight: theme.typography.bodyLarge?.fontWeight,
                    lineHeight: theme.typography.bodyLarge?.lineHeight,
                    letterSpacing: 0.2,
                    color: theme.palette.learner.dark,
                    width: 500,
                    alignItems: "center",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.learner.main,
                    fontWeight: theme.typography.bodyLarge?.fontWeight,
                    lineHeight: theme.typography.bodyLarge?.lineHeight,
                    letterSpacing: 0.32,
                  },
                }}
              />
              <TextField
                label="Confirm new password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                placeholder="Rewrite your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    fontSize: theme.typography.bodyLarge?.fontSize,
                    fontWeight: theme.typography.bodyLarge?.fontWeight,
                    lineHeight: theme.typography.bodyLarge?.lineHeight,
                    letterSpacing: 0.2,
                    color: theme.palette.learner.dark,
                    width: 500,
                    alignItems: "center",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.learner.main,
                    fontWeight: theme.typography.bodyLarge?.fontWeight,
                    lineHeight: theme.typography.bodyLarge?.lineHeight,
                    letterSpacing: 0.32,
                  },
                }}
              />
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignSelf: "stretch",
              }}
            >
              <Button
                variant="contained"
                color="learner"
                onClick={onSubmitNewPasswordClick} // Navigate instead of alert
                sx={{
                  padding: "20px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 1,
                  width: 500,
                  backgroundColor: theme.palette.learner.main,
                  color: "white",
                  fontSize: theme.typography.bodyLarge?.fontSize,
                  fontWeight: theme.typography.titleSmall?.fontWeight,
                  lineHeight: theme.typography.bodyLarge?.lineHeight,
                  letterSpacing: 0.08,
                  textTransform: "none",
                  marginTop: 4,
                  "&:hover": {
                    backgroundColor: "#002A32",
                  },
                  "&:active": {
                    backgroundColor: theme.palette.learner.dark,
                  },
                }}
              >
                Create Password
              </Button>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 2,
                  padding: 0,
                }}
              >
                <Typography
                  variant="bodySmall"
                  sx={{
                    color: theme.palette.learner.main,
                    textAlign: "right",
                    fontSize: theme.typography.bodySmall?.fontSize,
                    fontWeight: theme.typography.bodySmall?.fontWeight,
                    lineHeight: theme.typography.bodySmall?.lineHeight,
                    letterSpacing: 0.625,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  onClick={handleOpenHelpModal} // Open Help modal on click
                >
                  Help
                </Typography>
              </Container>
            </Container>
          </form>
        </Container>
      </Container>
      <CreatePasswordHelpModal
        open={isHelpModalOpen}
        onClose={handleCloseHelpModal} // Close modal handler
      />
    </Container>
  );
};

export default CreatePasswordPage;
