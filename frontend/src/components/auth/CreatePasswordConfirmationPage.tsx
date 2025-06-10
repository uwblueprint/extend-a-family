import React from "react";
import { Container, Typography, Button, Box, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useHistory } from "react-router-dom";
import Logo from "../assets/logoColoured.png";
import { LANDING_PAGE } from "../../constants/Routes";
import { useUser } from "../../hooks/useUser";

const CreatePasswordConfirmationPage = (): React.ReactElement => {
  const user = useUser();
  const history = useHistory();
  const theme = useTheme();
  const handleBackToHome = () => {
    user.status = "Active";
    history.push(LANDING_PAGE);
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
          marginTop: "-346px",
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
          gap: theme.spacing(4),
        }}
      >
        {/* Icon and Text Container */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: theme.spacing(2.5),
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
              color: theme.palette.Neutral[700],
              textAlign: "center",
              fontSize: theme.typography.bodyMedium.fontSize,
              fontStyle: "normal",
              fontWeight: theme.typography.bodyMedium.fontWeight,
              lineHeight: theme.typography.bodyMedium.lineHeight,
              letterSpacing: theme.typography.bodyMedium.letterSpacing,
            }}
          >
            Thank you for creating your password! Please login to start
            learning.
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
            gap: theme.spacing(1),
            borderRadius: "4px",
            background: theme.palette[`${user.role}`].Default,
            color: theme.palette.Neutral[100],
            textAlign: "center",
            fontSize: theme.typography.labelLarge.fontSize,
            fontStyle: "normal",
            fontWeight: theme.typography.labelLarge.fontWeight,
            lineHeight: theme.typography.labelLarge.lineHeight,
            letterSpacing: theme.typography.labelLarge.letterSpacing,
            textTransform: theme.typography.labelLarge.textTransform,
            "&:hover": {
              background: theme.palette[`${user.role}`].Pressed,
            },
          }}
          onClick={handleBackToHome}
        >
          LOGIN
        </Button>
      </Container>
    </Container>
  );
};

export default CreatePasswordConfirmationPage;
