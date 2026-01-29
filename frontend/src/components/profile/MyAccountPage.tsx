import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import { Button, Container, Typography, useTheme } from "@mui/material";
import React, { useContext, useState } from "react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import userAPIClient from "../../APIClients/UserAPIClient";
import AuthContext from "../../contexts/AuthContext";
import { isAuthenticatedFacilitator } from "../../types/AuthTypes";
import { isFacilitator } from "../../types/UserTypes";
import MainPageButton from "../common/MainPageButton";
import UploadProfilePictureModal from "../user_management/UploadProfilePictureModal";
import EmailPrefrencesButton from "./EmailPrefrencesButtons";
import ChangePasswordModal from "./ChangePasswordModal";
import EditDetailsModal from "./EditDetailsModal";
import ProfilePicture from "./ProfilePicture";

const MyAccount = (): React.ReactElement => {
  const theme = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { setAuthenticatedUser, authenticatedUser } = useContext(AuthContext);
  const [localEmailPrefrence, setLocalEmailPrefrence] = useState<number>(
    authenticatedUser &&
      isAuthenticatedFacilitator(authenticatedUser) &&
      authenticatedUser.emailPrefrence
      ? authenticatedUser.emailPrefrence
      : 1,
  );

  if (!authenticatedUser) {
    return <Typography>Please log in to view your account.</Typography>;
  }

  const handleSaveDetails = async (
    firstName: string,
    lastName: string,
    bio?: string | undefined,
    emailPrefrence?: number | undefined,
  ) => {
    try {
      if (!authenticatedUser || !authenticatedUser.id) {
        throw new Error("User information is not available.");
      }

      const updatedUser = await userAPIClient.updateUserDetails(
        firstName,
        lastName,
        authenticatedUser.role,
        authenticatedUser.status,
        bio,
        emailPrefrence,
      );

      setAuthenticatedUser({
        ...authenticatedUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: isFacilitator(updatedUser) ? updatedUser.bio : undefined,
        emailPrefrence,
      });

      setIsEditModalOpen(false);
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

  const handleEmailPrefrenceClick = async (emailPrefrence: number) => {
    setLocalEmailPrefrence(emailPrefrence);
    if (
      isAuthenticatedFacilitator(authenticatedUser) &&
      authenticatedUser.emailPrefrence !== emailPrefrence
    ) {
      await handleSaveDetails(
        authenticatedUser.firstName,
        authenticatedUser.lastName,
        authenticatedUser.bio,
        emailPrefrence,
      );
    }
  };

  return (
    <>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          display: "flex",
          padding: "48px 0px",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          flex: "1 0 0",
          alignSelf: "stretch",
          background: theme.palette.Neutral[200],
          overflowY: "scroll",
          height: "100%",
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
            size={160}
            setUploadModalOpen={setUploadModalOpen}
            sourceUrl={authenticatedUser.profilePicture}
          />

          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              padding: 0,
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
                sx={{ display: "flex", justifyContent: "space-between" }}
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
                sx={{ display: "flex", justifyContent: "space-between" }}
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
                sx={{ display: "flex", justifyContent: "space-between" }}
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
          </Container>
          {isAuthenticatedFacilitator(authenticatedUser) && (
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Typography variant="headlineSmall">Bio</Typography>
              {authenticatedUser.bio ? (
                <Typography
                  variant="bodyMedium"
                  sx={{ color: theme.palette.Neutral[700] }}
                >
                  {authenticatedUser.bio}
                </Typography>
              ) : (
                <Typography
                  variant="bodySmall"
                  sx={{ color: theme.palette.Neutral[500] }}
                >
                  Add a bio to help your learners get to know you!
                </Typography>
              )}
            </Container>
          )}
          {isAuthenticatedFacilitator(authenticatedUser) && (
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Typography variant="headlineSmall">Email Me...</Typography>
              <EmailPrefrencesButton
                setPrefrence={handleEmailPrefrenceClick}
                selectedId={localEmailPrefrence}
                buttonId={5}
                text="Once I have 5 unread notifications"
              />
              <EmailPrefrencesButton
                setPrefrence={handleEmailPrefrenceClick}
                selectedId={localEmailPrefrence}
                buttonId={1}
                text="For all notiifcations"
              />
              <EmailPrefrencesButton
                setPrefrence={handleEmailPrefrenceClick}
                selectedId={localEmailPrefrence}
                buttonId={-1}
                text="Never"
              />
            </Container>
          )}
          <Container>
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
                    theme.palette[authenticatedUser.role].Dark.Default,
                  "&:hover": {
                    background:
                      theme.palette[authenticatedUser.role].Dark.Pressed,
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
                  backgroundColor: theme.palette.Error.Light.Default,
                  "&:hover": {
                    background: theme.palette.Error.Light.Hover,
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
                  <PasswordIcon
                    sx={{ color: theme.palette.Error.Dark.Default }}
                  />
                  <Typography
                    variant="labelLarge"
                    sx={{ color: theme.palette.Error.Dark.Default }}
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
        bio={
          isAuthenticatedFacilitator(authenticatedUser)
            ? authenticatedUser.bio
            : undefined
        }
        emailPrefrence={
          isAuthenticatedFacilitator(authenticatedUser)
            ? authenticatedUser.emailPrefrence
            : undefined
        }
        onSave={handleSaveDetails}
      />
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
      <UploadProfilePictureModal
        open={uploadModalOpen}
        setUploadModalOpen={setUploadModalOpen}
      />
    </>
  );
};

export default MyAccount;
