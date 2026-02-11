import React from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useHistory } from "react-router-dom";
import logo from "../assets/logoColoured.png";
import { WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

const SignupPending = (): React.ReactElement => {
  const theme = useTheme();
  const history = useHistory();
  const { setAuthenticatedUser } = React.useContext(AuthContext);
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
            width: "450px",
            height: "200px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <AccessTimeIcon
            sx={{ fontSize: 60, color: theme.palette.Neutral[700] }}
          />
          <Typography
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[700], textAlign: "center" }}
          >
            Your account is almost ready! An administrator needs to approve it
            first. We’ll email you as soon as it’s approved.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.Facilitator.Dark.Default,
              display: "flex",
              flexDirection: "column",
              width: "145px",
              height: "45px",
              padding: "24px 10px 24px 10px",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              setAuthenticatedUser(null);
              history.push(WELCOME_PAGE);
            }}
          >
            <Typography variant="labelLarge">Retry</Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPending;
