import React from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useHistory } from "react-router-dom";

import Logo from "../images/logo.svg";
import { LOGIN_PAGE } from "../../constants/Routes";

const CreatePasswordConfirmationPage = (): React.ReactElement => {
  const history = useHistory();
  // const theme = useTheme();
  
  const handleBackToLogin = () => {
    history.push(LOGIN_PAGE);
  };

  return (
    <Container
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          width: "125.874px",
          height: "60px",
          marginTop:"-168px",
          marginBottom: "200px",
        }}
      />

      {/* Inner Content */}
      <Container
        sx={{
          display: "flex",
          width: "500px",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Icon and Text Container */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            alignSelf: "stretch",
          }}
        >
          {/* Check Icon */}
          <CheckCircleOutlineIcon
            sx={{
              fontSize: "48px",
              color: "black",
            }}
          />

          {/* Text */}
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "var(--Neutral-700, #111)",
              textAlign: "center",
              fontFamily: "Lexend Deca",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "140%",
              letterSpacing: "0.2px",
            }}
          >
            Thank you for creating your password! Please login to start learning.
          </Typography>
        </Container>

        {/* Login Button */}
        <Button
          variant="contained"
          sx={{
            display: "flex",
            height: "45px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            background: "var(--Learner-Default, #006877)",
            color: "var(--Neutral-100, #FFF)",
            textAlign: "center",
            fontFamily: "Lexend Deca",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "300",
            lineHeight: "120%",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            "&:hover": {
              background: "var(--Learner-Hover, #005566)",
            },
          }}
          onClick={handleBackToLogin}
        >
          LOGIN
        </Button>
      </Container>
    </Container>
  );
};

export default CreatePasswordConfirmationPage;
