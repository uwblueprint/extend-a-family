import React, { useState } from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Logo from "../images/logo.svg";
import CreatePasswordHelpModal from "../help/CreatePasswordHelpModal";
import CreatePasswordConfirmationPage from "./CreatePasswordConfirmationPage";
import PasswordCheck from "../auth/PasswordCheck";

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
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#000",
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
                backgroundColor: theme.palette.learner.main,
                "&:hover": { backgroundColor: "#002A32" },
                "&.Mui-disabled": {
                  backgroundColor: "#ccc",
                  color: "#666",
                },
              }}
            >
              Create Password
            </Button>
            <Typography
              sx={{
                textAlign: "right",
                marginTop: 2,
                color: theme.palette.learner.main,
                cursor: "pointer",
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
