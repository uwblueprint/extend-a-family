import React, { useContext, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AlternateEmail,
  BadgeOutlined,
  Password,
  Close,
} from "@mui/icons-material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import logo from "../assets/logoColoured.png";
import { getSignUpPath, getSignUpPrompt } from "./WelcomePage";
import Login from "./Login";
import {
  AuthErrorCodes,
  authErrors,
  defaultAuthError,
} from "../../errors/AuthErrors";
import { PresentableError } from "../../types/ErrorTypes";
import { isAuthenticatedUser } from "../../types/AuthTypes";

interface ErrorAlertProps {
  title?: string;
  message?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, message }) => {
  const theme = useTheme();
  const alertRef = useRef<HTMLDivElement>(null);
  return (
    <Box ref={alertRef} sx={{ width: "100%" }}>
      <Alert
        icon={false}
        severity="error"
        sx={{
          color: theme.palette.Error.Light,
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          border: "2px solid",
          borderColor: theme.palette.Error.Hover,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "& .MuiAlert-message": { padding: 0 },
        }}
      >
        <AlertTitle marginBottom="3px">
          <Typography variant="titleMedium" color={theme.palette.Error.Default}>
            {title || "Error"}
          </Typography>
        </AlertTitle>
        <Typography variant="bodyMedium" color={theme.palette.Error.Pressed}>
          {message || "An error has occurred."}
        </Typography>
      </Alert>
    </Box>
  );
};

const Signup = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const theme = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorData, setErrorData] = useState<PresentableError | null>(null);
  const [emailError, setEmailError] = useState<PresentableError | null>(null);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);

  const onSignupClick = async () => {
    setEmailError(null);
    setErrorData(null);
    const response = await authAPIClient.signup(
      firstName,
      lastName,
      email,
      password,
      "Facilitator",
    );

    if (!isAuthenticatedUser(response)) {
      switch (response) {
        case AuthErrorCodes.EMAIL_IN_USE:
          setErrorData(authErrors.EMAIL_IN_USE);
          break;

        case AuthErrorCodes.INVALID_EMAIL:
          setEmailError(authErrors.INVALID_EMAIL);
          break;

        default:
          setErrorData(defaultAuthError);
          break;
      }
    }
    return null;
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
          <Typography variant="headlineLarge">
            Sign Up as a Facilitator
          </Typography>

          {errorData && (
            <Box>
              <ErrorAlert
                title={errorData.title?.()}
                message={errorData.text?.()}
              />
            </Box>
          )}

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
            error={!!emailError}
            helperText={emailError?.text()}
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
                bgcolor: theme.palette.Facilitator.Default,
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
                "&:hover": {
                  bgcolor: theme.palette.Facilitator.Default,
                },
              }}
            >
              <Typography variant="labelLargeProminent">
                Sign up as a facilitator
              </Typography>
            </Button>
            <Stack direction="row" sx={{ position: "relative" }}>
              <Link href={WELCOME_PAGE}>
                <Typography
                  variant="labelSmall"
                  sx={{
                    color: theme.palette.Facilitator.Default,
                    position: "absolute",
                    left: 0,
                  }}
                >
                  Not a facilitator?
                </Typography>
              </Link>
              <Button
                variant="text"
                onClick={() => setLoginDrawerOpen(true)}
                sx={{
                  position: "absolute",
                  right: 0,
                  width: "50%",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    color: theme.palette.Facilitator.Default,
                    position: "absolute",
                    right: 0,
                  }}
                >
                  Already have an account?
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Drawer
        PaperProps={{
          sx: { maxWidth: "560px", width: "100%" },
        }}
        anchor="right"
        open={loginDrawerOpen}
        onClose={() => setLoginDrawerOpen(false)}
        style={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => setLoginDrawerOpen(false)}
          style={{
            position: "absolute",
            right: 56,
            top: 56,
          }}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loginDrawerOpen && (
            <Login
              userRole="Facilitator"
              isDrawerComponent
              signUpPrompt={getSignUpPrompt("Facilitator")}
              signUpPath={getSignUpPath("Facilitator")}
            />
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default Signup;
