import React, { useState } from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Logo from "../images/logo.svg";
import CreatePasswordHelpModal from "../help/CreatePasswordHelpModal";
import CreatePasswordConfirmationPage from "./CreatePasswordConfirmationPage";
import PasswordCheck from "../auth/PassowrdCheck";

const CreatePasswordPage = (): React.ReactElement => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const theme = useTheme();

  const onSubmitNewPasswordClick = () => {
    if (isFormValid) {
      setIsPasswordConfirmed(true);
    } else {
      alert("Passwords do not match or do not meet the criteria.");
    }
  };

  const handleOpenHelpModal = () => setIsHelpModalOpen(true);
  const handleCloseHelpModal = () => setIsHelpModalOpen(false);

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
        gap: "70px",
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
              fontWeight: theme.typography.headlineLarge?.fontWeight,
              color: theme.palette.Neutral[700],
              textAlign: "center",
            }}
          >
            Create Password
          </Typography>
          <form>
            <PasswordCheck
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              onValidationChange={setIsFormValid}
            />
            <Button
              variant="contained"
              onClick={onSubmitNewPasswordClick}
              disabled={!isFormValid}
              sx={{
                marginTop: 4,
                padding: "10px 24px",
                width: "100%",
                textTransform: "none",
                backgroundColor: theme.palette.Learner.Default,
                "&:hover": {
                  background: "var(--Learner-Hover, #005566)",  // make theme.ts variables for button hover values
                },
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.Neutral[400],
                  color: theme.palette.Neutral[600],
                },
              }}
            >
              Create Password
            </Button>
            <Typography
              sx={{
                textAlign: "right",
                marginTop: 2,
                marginRight: "12px",
                color: theme.palette.Learner.Default,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={handleOpenHelpModal}
            >
              Help
            </Typography>
          </form>
        </Container>
      </Container>
      <CreatePasswordHelpModal
        open={isHelpModalOpen}
        onClose={handleCloseHelpModal}
      />
    </Container>
  );
};

export default CreatePasswordPage;
