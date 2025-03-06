import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  Button,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { useUser } from "../../hooks/useUser";
import MainPageButton from "../common/MainPageButton";
import ProfilePicture from "../profile/ProfileButton";
import EditDetailsModal from "../profile/EditDetailsModal";
import ChangePasswordModal from "../profile/ChangePasswordModal";
import AuthContext from "../../contexts/AuthContext";

const MyAccount = (): React.ReactElement => {
  const userFromHook = useUser(); // Get the user object from the useUser hook
  const [user, setUser] = useState(userFromHook); // Create a local state for user
  const theme = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const { setAuthenticatedUser, authenticatedUser } = useContext(AuthContext);

  const handleSaveDetails = async (firstName: string, lastName: string) => {
    try {
      if (!user || !user.id) {
        throw new Error("User information is not available.");
      }

      // Prepare the payload for the update
      const updatePayload = {
        firstName,
        lastName,
        email: user.email, // Keep the email unchanged
        role: user.role,   // Keep the role unchanged
        status: "Active",  // Keep the status unchanged
      };

      // Call the PUT endpoint directly using fetch
      const response = await fetch(`/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add authorization token if needed
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }

      const updatedUser = await response.json();

      // Update the user object in the component state
      setUser({
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });

      // Update the authenticated user in context to reflect changes
      if (authenticatedUser && user.id === authenticatedUser.id) {
        setAuthenticatedUser({
          ...authenticatedUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        });
      }

      // Show success message
      setSnackbarMessage("Details updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Close the modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      setSnackbarMessage("Failed to update details. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSavePassword = async () => {
    try {
      // Call the API to update the password

      // Show success message
      setSnackbarMessage("Password updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating password:", error);
      setSnackbarMessage("Failed to update password. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
          background: "#F8F9FA",
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
            background: "#FFF",
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
            <Typography
              sx={{
                color: "var(--Schemes-On-Background, #171D1E)",
                fontFamily: "Lexend Deca",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "120%",
              }}
            >
              Your Account
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "var(--Schemes-Outline, #6F797B)",
                fontFamily: "Lexend Deca",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0.2px",
              }}
            >
              View and edit your details
            </Typography>
          </Container>

          <ProfilePicture firstName={user.firstName} lastName={user.lastName} />

          <Container
            sx={{
              display: "flex",
              width: "400px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <Typography
              sx={{
                color: "#000",
                fontFamily: "Lexend Deca",
                fontSize: "26px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
              }}
            >
              Details
            </Typography>
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
                  variant="body1"
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  First Name
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.2px",
                  }}
                >
                  {user.firstName}
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
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  Last Name
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.2px",
                  }}
                >
                  {user.lastName}
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
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.2px",
                  }}
                >
                  {user.email}
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
                  backgroundColor: theme.palette[`${user.role}`].Default,
                  "&:hover": {
                    background: theme.palette[`${user.role}`].Pressed,
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
                  <ModeEditOutlineOutlinedIcon sx={{ color: "#FFFFFF" }} />
                  <Typography
                    sx={{
                      color: "var(--M3-sys-light-on-primary, #FFF)",
                      textAlign: "center",
                      fontFamily: "Lexend Deca",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 300,
                      lineHeight: "120%",
                      letterSpacing: "0.7px",
                      textTransform: "uppercase",
                    }}
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
                  <PasswordIcon sx={{ color: "#BA1A1A" }} />
                  <Typography
                    sx={{
                      color: "var(--Error-Default, #BA1A1A)",
                      textAlign: "center",
                      fontFamily: "Lexend Deca",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 300,
                      lineHeight: "120%",
                      letterSpacing: "0.7px",
                      textTransform: "uppercase",
                    }}
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
        firstName={user.firstName}
        lastName={user.lastName}
        onSave={handleSaveDetails}
      />
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyAccount;