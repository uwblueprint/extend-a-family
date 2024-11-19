import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock"; // Import for icon used in TextField

const CreatePasswordPage = (): React.ReactElement => {
  const [newPassword, setNewPassword] = useState("");

  const onSubmitNewPasswordClick = () => {
    alert("Password updated (placeholder functionality).");
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Container
        sx={{
          display: "flex",
          width: 548,
          flexDirection: "column",
          gap: 4,
          padding: 0,
        }}
      >
        <Container
          sx={{
            display: "flex",
            paddingBottom: 2,
            flexDirection: "column",
            width: 548,
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 1,
            padding: 0,
            marginLeft: -3,
          }}
        >
          <Typography
            variant="headlineLarge"
            gutterBottom
            sx={{
              fontSize: (theme) => theme.typography.headlineMedium?.fontSize,
              fontWeight: (theme) =>
                theme.typography.headlineLarge?.fontWeight,
              lineHeight: (theme) =>
                theme.typography.headlineLarge?.lineHeight,
              color: "#000",
            }}
          >
            Create Password
          </Typography>
        </Container>
        <form>
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
                  <LockIcon />
                </InputAdornment>
              ),
              sx: {
                fontSize: (theme) => theme.typography.bodyLarge?.fontSize,
                fontWeight: (theme) => theme.typography.bodyLarge?.fontWeight,
                lineHeight: (theme) => theme.typography.bodyLarge?.lineHeight,
                letterSpacing: 0.2,
                color: (theme) => theme.palette.learner.dark,
              },
            }}
            InputLabelProps={{
              sx: {
                color: (theme) => theme.palette.learner.main,
                fontWeight: (theme) =>
                  theme.typography.bodyLarge?.fontWeight,
                lineHeight: (theme) =>
                  theme.typography.bodyLarge?.lineHeight,
                letterSpacing: 0.32,
              },
            }}
          />
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="learner"
              onClick={onSubmitNewPasswordClick}
              sx={{
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                borderRadius: 1,
                width: 500,
                backgroundColor: (theme) => theme.palette.learner.main,
                color: (theme) => theme.palette.learner.light,
                fontSize: (theme) => theme.typography.bodyLarge?.fontSize,
                fontWeight: (theme) => theme.typography.titleSmall?.fontWeight,
                lineHeight: (theme) => theme.typography.bodyLarge?.lineHeight,
                letterSpacing: 0.08,
                textTransform: "none",
                marginTop: 4,
                "&:hover": {
                  backgroundColor: "#002A32",
                },
                "&:active": {
                  backgroundColor: (theme) => theme.palette.learner.dark,
                },
              }}
            >
              Create Password
            </Button>
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default CreatePasswordPage;
