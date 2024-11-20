import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AlternateEmail, BadgeOutlined, Password } from "@mui/icons-material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import logo from "../assets/logoColoured.png";

const Signup = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const theme = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignupClick = async () => {
    const user: AuthenticatedUser | null = await authAPIClient.signup(
      firstName,
      lastName,
      email,
      password,
      "Facilitator",
    );

    if (!user) {
      // will need to change this for different errors
      // eslint-disable-next-line no-alert
      alert("Something went wrong with signup");
      return;
    }

    // eslint-disable-next-line no-alert
    alert("Signup successful, verification link was sent to your email.");
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

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
          display: "flex",
          width: "500px",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "500px",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
            marginTop: "12.62%",
          }}
        >
          <Typography sx={theme.typography.headlineLarge}>
            Sign Up as a Facilitator
          </Typography>
          <TextField
            required
            label="First Name"
            type="text"
            placeholder="John"
            onChange={(event) => setFirstName(event.target.value)}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              maxHeight: "56px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            label="Last Name"
            type="text"
            placeholder="Doe"
            onChange={(event) => setLastName(event.target.value)}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              maxHeight: "56px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              maxHeight: "56px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            label="Password"
            type="password"
            placeholder="Your Password"
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              maxHeight: "56px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Password />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              gap: "20px",
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
            }}
          >
            <Button
              variant="contained"
              onClick={onSignupClick}
              fullWidth
              sx={{
                bgcolor: "facilitator.main",
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
                "&:hover": {
                  bgcolor: "facilitator.dark",
                },
              }}
            >
              <Typography sx={theme.typography.labelLargeProminent}>
                Sign up as a facilitator
              </Typography>
            </Button>
            <Stack direction="row" sx={{ position: "relative" }}>
              <Link href={WELCOME_PAGE}>
                <Typography
                  sx={{
                    ...theme.typography.labelSmall,
                    color: "facilitator.main",
                    position: "absolute",
                    left: 0,
                  }}
                >
                  Not a facilitator?
                </Typography>
              </Link>
              <Link href={WELCOME_PAGE}>
                <Typography
                  sx={{
                    ...theme.typography.labelSmall,
                    color: "facilitator.main",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  Already have an account?
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
