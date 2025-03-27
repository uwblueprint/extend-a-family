import React, { useState, useContext } from "react";
import { Container, Typography, Button, useTheme } from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import MainPageButton from "../common/MainPageButton";
import ProfilePicture from "../profile/ProfilePicture";
import EditDetailsModal from "../profile/EditDetailsModal";
import ChangePasswordModal from "../profile/ChangePasswordModal";
import AuthContext from "../../contexts/AuthContext";
import userAPIClient from "../../APIClients/UserAPIClient";
import authAPIClient from "../../APIClients/AuthAPIClient";

const MyAccount = (): React.ReactElement => {
  const theme = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const { setAuthenticatedUser, authenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <Typography>Please log in to view your account.</Typography>;
  }

  const handleSaveDetails = async (firstName: string, lastName: string) => {
    try {
      if (!authenticatedUser || !authenticatedUser.id) {
        throw new Error("User information is not available.");
      }

      const updatedUser = await userAPIClient.updateUserDetails(
        authenticatedUser.id,
        firstName,
        lastName,
        authenticatedUser.role,
        authenticatedUser.status,
      );

      setAuthenticatedUser({
        ...authenticatedUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating user details:", error);
    }
  };

  const handleSavePassword = async (newPassword: string) => {
    try {
      if (!authenticatedUser || !authenticatedUser.email) {
        throw new Error("User information is not available.");
      }
      const success = await authAPIClient.changePassword(
        authenticatedUser.email,
        newPassword,
        authenticatedUser.role,
      );

      if (!success) {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating password:", error);
    }
  };

  return (
    <>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          display: "flex",
          padding: "48px",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          flex: "1 0 0",
          alignSelf: "stretch",
          background: theme.palette.Neutral[200],
          height: "92vh",
        }}
      >
        <MainPageButton />
        <Container
          sx={{
            display: "flex",
            padding: "32px",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
            borderRadius: "16px",
            background: theme.palette.Neutral[100],
            width: "464px",
            height: "653px",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Typography variant="headlineMedium">Your Account</Typography>
            <Typography
              variant="bodyMedium"
              sx={{ color: theme.palette.Neutral[500] }}
            >
              View and edit your details
            </Typography>
          </Container>

          <ProfilePicture
            firstName={authenticatedUser.firstName}
            lastName={authenticatedUser.lastName}
          />

          <Container
            sx={{
              display: "flex",
              width: "400px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <Typography variant="headlineSmall">Details</Typography>
            <Container
              disableGutters
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
              }}
            >
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="bodySmall"
                  sx={{ color: theme.palette.Neutral[500] }}
                >
                  First Name
                </Typography>
                <Typography
                  variant="bodyMedium"
                  sx={{ color: theme.palette.Neutral[700] }}
                >
                  {authenticatedUser.firstName}
                </Typography>
              </Container>
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="bodySmall"
                  sx={{ color: theme.palette.Neutral[500] }}
                >
                  Last Name
                </Typography>
                <Typography
                  variant="bodyMedium"
                  sx={{ color: theme.palette.Neutral[700] }}
                >
                  {authenticatedUser.lastName}
                </Typography>
              </Container>
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="bodySmall"
                  sx={{ color: theme.palette.Neutral[500] }}
                >
                  Email
                </Typography>
                <Typography
                  variant="bodyMedium"
                  sx={{ color: theme.palette.Neutral[700] }}
                >
                  {authenticatedUser.email}
                </Typography>
              </Container>
            </Container>
            <Container
              disableGutters
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              <Button
                onClick={() => setIsEditModalOpen(true)}
                sx={{
                  display: "flex",
                  height: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  backgroundColor:
                    theme.palette[authenticatedUser.role].Default,
                  "&:hover": {
                    background: theme.palette[authenticatedUser.role].Pressed,
                  },
                  padding: "10px 24px 10px 16px",
                  flex: "1 0 0",
                }}
              >
                <Container
                  sx={{
                    display: "flex",
                    padding: "10px 24px 10px 16px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    flex: "1 0 0",
                    alignSelf: "stretch",
                  }}
                >
                  <ModeEditOutlineOutlinedIcon
                    sx={{ color: theme.palette.Neutral[100] }}
                  />
                  <Typography
                    variant="labelLarge"
                    sx={{ color: theme.palette.Neutral[100] }}
                  >
                    Edit Details
                  </Typography>
                </Container>
              </Button>
              <Button
                onClick={() => setIsChangePasswordModalOpen(true)}
                sx={{
                  display: "flex",
                  height: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.Error.Light,
                  "&:hover": {
                    background: theme.palette.Error.Hover,
                  },
                  padding: "10px 24px 10px 16px",
                  flex: "1 0 0",
                }}
              >
                <Container
                  sx={{
                    display: "flex",
                    padding: "10px 24px 10px 16px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    flex: "1 0 0",
                    alignSelf: "stretch",
                  }}
                >
                  <PasswordIcon sx={{ color: theme.palette.Error.Default }} />
                  <Typography
                    variant="labelLarge"
                    sx={{ color: theme.palette.Error.Default }}
                  >
                    Change Password
                  </Typography>
                </Container>
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>

      <EditDetailsModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        firstName={authenticatedUser.firstName}
        lastName={authenticatedUser.lastName}
        onSave={handleSaveDetails}
      />
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
    </>
  );
};

export default MyAccount;
