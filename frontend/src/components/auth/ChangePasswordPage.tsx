import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthAPIClient from "../../APIClients/AuthAPIClient";
import Logo from "../assets/logoColoured.png";
import CreatePasswordConfirmationPage from "./CreatePasswordConfirmationPage";
import PasswordCheck from "./PasswordCheck";

const ChangePasswordPage = (): React.ReactElement => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const theme = useTheme();

  const { search } = useLocation();
  const authId = new URLSearchParams(search).get("authId");
  const requestedTime = new URLSearchParams(search).get("requestedTime");

  const onSubmitNewPasswordClick = async () => {
    if (!authId || !requestedTime) {
      // eslint-disable-next-line no-alert
      alert("Invalid password reset link.");
      return;
    }

    const changePasswordResult = await AuthAPIClient.changePasswordFromId(
      authId,
      newPassword,
      requestedTime,
    );

    if (!changePasswordResult.success) {
      // eslint-disable-next-line no-alert
      alert(changePasswordResult.message);
      return;
    }

    if (isFormValid) {
      setIsPasswordConfirmed(true);
    } else {
      // eslint-disable-next-line no-alert
      alert("Passwords do not match or do not meet the criteria.");
    }
  };

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
            variant="h5"
            gutterBottom
            sx={{
              color: theme.palette.Neutral[700],
              textAlign: "center",
            }}
          >
            Change Password
          </Typography>
          <form>
            <PasswordCheck
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              passwordLabel="New Password"
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
                backgroundColor: theme.palette.Learner.Dark.Default,
                "&:hover": {
                  background: theme.palette.Learner.Dark.Pressed,
                },
                "&.Mui-disabled": {
                  backgroundColor: "#ccc",
                  color: "#666",
                },
              }}
            >
              Change Password
            </Button>
          </form>
        </Container>
      </Container>
    </Container>
  );
};

export default ChangePasswordPage;
