import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  useTheme,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useHistory, Redirect } from "react-router-dom";

import AuthContext from "../../../contexts/AuthContext";
import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation";
import authAPIClient from "../../../APIClients/AuthAPIClient";
import { LOGIN_PAGE, HOME_PAGE } from "../../../constants/Routes";

const ForgotPasswordPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const history = useHistory();
  const theme = useTheme();

  const { authenticatedUser } = useContext(AuthContext);
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const handleResetPassword = async () => {
    try {
      const response = await authAPIClient.resetPassword(email);
      if (response) {
        setIsEmailSent(true);
      }
    } catch (error) {
      setIsEmailSent(false);
    }
  };

  const handleBackToEmail = () => {
    setIsEmailSent(false);
    setEmail("");
  };

  const handleBackToLogin = () => {
    history.push(LOGIN_PAGE);
  };

  if (isEmailSent) {
    return (
      <ForgotPasswordConfirmation
        email={email}
        onBackToEmail={handleBackToEmail}
      />
    );
  }

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
              fontSize: theme.typography.headlineMedium?.fontSize,
              fontWeight: theme.typography.headlineLarge?.fontWeight,
              lineHeight: theme.typography.headlineLarge?.lineHeight,
            }}
          >
            Forgot your password?
          </Typography>
          <Typography variant="bodyMedium"
           sx={{
            fontSize: theme.typography.bodyLarge?.fontSize,
          }}>
            Enter your email, and we&apos;ll send you a link to reset your
            password
          </Typography>
        </Container>
        <form>
          <TextField
            label="Your email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            placeholder="example@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              ),
              sx: {
                fontSize: theme.typography.bodyLarge?.fontSize,
                fontWeight: theme.typography.bodyLarge?.fontWeight,
                lineHeight: theme.typography.bodyLarge?.lineHeight,
                letterSpacing: 0.2,
                color: theme.palette.neutral.dark,
              },
            }}
            InputLabelProps={{
              sx: {
                color: theme.palette.neutral.main,
                fontWeight: theme.typography.bodyLarge?.fontWeight,
                lineHeight: theme.typography.bodyLarge?.lineHeight,
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
              onClick={handleResetPassword}
              sx={{
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                borderRadius: 1,
                width: 500,
                backgroundColor: theme.palette.learner.main,
                color: theme.palette.neutral.light,
                fontSize: theme.typography.bodyLarge?.fontSize,
                fontWeight: theme.typography.bodyLarge?.fontWeight,
                lineHeight: theme.typography.bodyLarge?.lineHeight,
                letterSpacing: 0.08,
                textTransform: "none",
                marginTop: 4,
                "&:hover": {
                  backgroundColor: theme.palette.learner.dark,
                },
                "&:active": {
                  backgroundColor: theme.palette.learner.dark,
                },
              }}
            >
              Send reset link to email
            </Button>
            <Typography
              variant="bodySmall"
              sx={{
                color: theme.palette.learner.main,
                textAlign: "center",
                fontSize: theme.typography.bodySmall?.fontSize,
                fontWeight: theme.typography.bodySmall?.fontWeight,
                lineHeight: theme.typography.bodySmall?.lineHeight,
                letterSpacing: 0.625,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              onClick={handleBackToLogin}
            >
              Remember your password? Back to Login
            </Typography>
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default ForgotPasswordPage;
