import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import AuthAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { LANDING_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { useUser } from "../../hooks/useUser";
import Logo from "../assets/logoColoured.png";
import CreatePasswordHelpModal from "../help/CreatePasswordHelpModal";
import CreatePasswordConfirmationPage from "./CreatePasswordConfirmationPage";
import PasswordCheck from "./PasswordCheck";

const CreatePasswordPage = (): React.ReactElement => {
  const user = useUser();

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const theme = useTheme();

  const onSubmitNewPasswordClick = async () => {
    if (!authenticatedUser) {
      // eslint-disable-next-line no-alert
      alert("User is not authenticated.");
      return;
    }

    const changePasswordSuccess = await AuthAPIClient.updateTemporaryPassword(
      authenticatedUser.email,
      newPassword,
      authenticatedUser.role,
    );

    if (!changePasswordSuccess) {
      setAuthenticatedUser(null);
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
      await AuthAPIClient.logout(authenticatedUser.id);
      // eslint-disable-next-line no-alert
      alert("Error occurred when changing your password. Please log in again.");
      return;
    }

    const updateStatusSuccess = await AuthAPIClient.updateUserStatus("Active");
    if (!updateStatusSuccess) {
      // eslint-disable-next-line no-alert
      alert('Failed to update user status to "Active"');
      return;
    }

    setAuthenticatedUser({
      ...authenticatedUser,
      status: "Active",
    });

    if (isFormValid) {
      setIsPasswordConfirmed(true);
    } else {
      // eslint-disable-next-line no-alert
      alert("Passwords do not match or do not meet the criteria.");
    }
  };

  const handleOpenHelpModal = () => setIsHelpModalOpen(true);
  const handleCloseHelpModal = () => setIsHelpModalOpen(false);

  if (user.status !== "Invited") {
    return <Redirect to={LANDING_PAGE} />;
  }

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
            Create Password
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
                backgroundColor: theme.palette[`${user.role}`].Dark.Default,
                "&:hover": {
                  background: theme.palette[`${user.role}`].Dark.Pressed,
                },
                "&.Mui-disabled": {
                  backgroundColor: "#ccc",
                  color: "#666",
                },
              }}
            >
              Create Password
            </Button>
            {`${user.role}` !== "Administrator" && (
              <Typography
                sx={{
                  textAlign: "right",
                  marginTop: 2,
                  marginRight: "12px",
                  color: theme.palette.Learner.Dark.Default,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleOpenHelpModal}
              >
                Help
              </Typography>
            )}
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
