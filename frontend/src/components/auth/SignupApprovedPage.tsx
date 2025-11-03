import React from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import logo from "../assets/logoColoured.png";
import { WELCOME_PAGE } from "../../constants/Routes";

const SignupApproved = (): React.ReactElement => {
  const theme = useTheme();
  return (
    <Container
      sx={{
        display: "flex",
        width: "37.5vw",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
      }}
      role="main"
    >
      <Box
        component="img"
        alt="Extend-A-Family Waterloo Region logo"
        src={logo}
        sx={{
          width: "125.874px",
          height: "60px",
          flexShrink: 0,
          marginTop: "6vh",
          marginBottom: "auto",
        }}
      />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "400px",
            height: "200px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 60, color: theme.palette.Neutral[700] }}
          />
          <Typography
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[700], textAlign: "center" }}
          >
            Your account has been approved. Please login to get started!
          </Typography>

          <Button
            variant="contained"
            href={WELCOME_PAGE}
            fullWidth
            sx={{
              bgcolor: theme.palette.Facilitator.Dark.Default,
              display: "flex",
              flexDirection: "column",
              width: "105px",
              height: "45px",
              padding: "24px 10px 24px 10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="labelLarge"> Log In </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupApproved;
