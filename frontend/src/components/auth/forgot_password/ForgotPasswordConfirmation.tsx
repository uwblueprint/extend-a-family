import React from "react";
import { Container, Typography, Button } from "@mui/material";

interface ForgotPasswordConfirmationProps {
  email: string;
  onBackToEmail: () => void;
}

const ForgotPasswordConfirmation: React.FC<ForgotPasswordConfirmationProps> = ({ email, onBackToEmail }) => {
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
          width: "500px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          flexShrink: 0,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            alignSelf: "stretch",
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
              lineHeight: "120%",
              marginBottom: 0,
            }}
          >
            Email sent
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#000",
              fontFamily: "Lexend Deca",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0.2px",
            }}
          >
            Check your email ({email}) and open the link we sent to continue.
          </Typography>
        </Container>
        <Button
          variant="text"
          color="primary"
          onClick={onBackToEmail}
          sx={{
            color: "#006877",
            fontSize: "12.5px",
            fontWeight: 300,
            lineHeight: "120%", 
            letterSpacing: "0.625px",
            textTransform: "uppercase",
            padding: 0,
          }}
        >
          NOT YOUR EMAIL? Go back to change your email
        </Button>
      </Container>
    </Container>
  );
};

export default ForgotPasswordConfirmation;
