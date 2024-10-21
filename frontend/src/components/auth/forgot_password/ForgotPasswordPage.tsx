import React, { useState } from "react";
import { Container, TextField, Button, Typography, InputAdornment } from "@mui/material";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation";

import authAPIClient from "../../../APIClients/AuthAPIClient";

const DivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const ForgotPasswordPage = (): React.ReactElement => {
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false); // New state to control rendering
  
    const onResetPasswordClick = async () => {
      const response = await authAPIClient.resetPassword(email);
      if (response) { // Check if the email was sent successfully
        setIsEmailSent(true);
      }
    };
  
    // Conditionally render either the form or the confirmation page
    if (isEmailSent) {
        return <ForgotPasswordConfirmation onBackToEmail={() => setIsEmailSent(false)} />;
      }


  return (
    <DivContainer>
      <Container
        sx={{
          display: "flex",
          width: "548px",
          flexDirection: "column",
          gap: "40px",
          padding: 0,
        }}
      >
        <Container
          sx={{
            display: "flex",
            paddingBottom: "20px",
            flexDirection: "column",
            width: "548px",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "8px",
            padding: 0,
            marginLeft: "-24px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#000",
              fontFamily: "Lexend Deca",
              fontSize: "28px",
              fontWeight: 600,
              width: "500px",
              lineHeight: "120%",
            }}
          >
            Forgot your password?
          </Typography>
          <Typography variant="body1">
            Enter your email, and we&apos;ll send you a link to reset your password
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
                fontSize: "16px",
                fontWeight: 400,
                width: "500px",
                lineHeight: "140%",
                letterSpacing: "0.2px",
                color: "#6F797B",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#3F484B",
                fontFamily: "Lexend Deca",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0.32px",
              },
            }}
          />
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onResetPasswordClick}
              sx={{
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "4px",
                width: "500px",
                background: "#006877",
                color: "#FFF",
                fontFamily: "Lexend Deca",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "120%",
                letterSpacing: "0.08px",
                textTransform: "none",
                marginTop: "32px",
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
                fontSize: "12.5px",
                fontWeight: 300,
                lineHeight: "120%",
                letterSpacing: "0.625px",
                textTransform: "uppercase",
              }}
            >
              Remember your password? Back to Login
            </Typography>
          </Container>
        </form>
      </Container>
    </DivContainer>
  );
};

export default ForgotPasswordPage;
