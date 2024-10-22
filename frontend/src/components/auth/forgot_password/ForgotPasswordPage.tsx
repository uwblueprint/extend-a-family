import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory, Redirect } from "react-router-dom";

import AuthContext from "../../../contexts/AuthContext";
import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation";
import authAPIClient from "../../../APIClients/AuthAPIClient";
import { LOGIN_PAGE, HOME_PAGE } from "../../../constants/Routes";

const ForgotPasswordPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const history = useHistory();

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
            variant="h4"
            gutterBottom
            sx={{
              color: "#000",
              fontFamily: "Lexend Deca",
              fontSize: 28,
              fontWeight: 600,
              width: 500,
              lineHeight: "120%",
            }}
          >
            Forgot your password?
          </Typography>
          <Typography variant="body1">
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
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                fontFamily: "Lexend Deca",
                fontSize: 16,
                fontWeight: 400,
                width: 500,
                lineHeight: "140%",
                letterSpacing: 0.2,
                color: "#6F797B",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#3F484B",
                fontFamily: "Lexend Deca",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "140%",
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
              color="primary"
              onClick={handleResetPassword}
              sx={{
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                borderRadius: 1,
                width: 500,
                backgroundColor: "#006877",
                color: "#FFF",
                fontFamily: "Lexend Deca",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "120%",
                letterSpacing: 0.08,
                textTransform: "none",
                marginTop: 4,
              }}
            >
              Send reset link to email
            </Button>
            <Typography
              variant="body2"
              sx={{
                color: "#006877",
                textAlign: "center",
                fontFamily: "Lexend Deca",
                fontSize: 12.5,
                fontWeight: 300,
                lineHeight: "120%",
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
