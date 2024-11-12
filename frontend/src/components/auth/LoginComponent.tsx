import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser, Role } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { authErrors } from "../../errors/AuthErrors";
import { PresentableError } from "../../types/ErrorTypes";

interface LoginProps {
  userRole: Role;
  isDrawerComponent: boolean;
  align?: "left" | "center" | "right"; // Restrict to valid values
}
const LoginComponent: React.FC<LoginProps> = ({
  userRole,
  isDrawerComponent,
  align = "left",
}: LoginProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState<PresentableError>();
  const [emailError, setEmailError] = useState<PresentableError>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const onLogInClick = async () => {
    try {
      setLoginError(undefined);
      setEmailError(undefined);
      const user: AuthenticatedUser | null = await authAPIClient.login(
        email,
        password,
        userRole,
      );

      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
      setAuthenticatedUser(user);
    } catch (e: unknown) {
      if (e instanceof Error && e.message in authErrors) {
        // eslint-disable-next-line no-alert
        alert(e.message);
      } else {
        // eslint-disable-next-line no-alert
        alert("bad!");
      }
    }
  };

  const DrawerComponent = () => {
    return (
      <Container style={{ textAlign: align }}>
        <h1>{capitalizeFirstLetter(userRole)} Login</h1>
        {loginError && (
          <div
            style={{
              backgroundColor: "lavenderblush",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            <strong>{loginError.title?.()}</strong>
            <br />
            {loginError.text()}
          </div>
        )}
        <form>
          <div>
            <TextField
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            {emailError && <p style={{ color: "red" }}>{emailError.text()}</p>}
          </div>
          <div>
            <TextField
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={onLogInClick}
              fullWidth
              style={{ margin: "16px 0" }}
            >
              Log In
            </Button>
          </div>
        </form>
      </Container>
    );
  };

  const MainComponent = () => {
    return (
      <Container
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "40px 40px 40px 20px",
          flexDirection: "column",
          justifyContent: "center",
        }}
        disableGutters
      >
        <Container
          style={{
            width: "100%",
            maxHeight: "254px",
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: " 40px",
            alignSelf: "stretch",
          }}
          disableGutters
        >
          <Box>
            <Typography
              style={{
                fontSize: "28px",
                fontWeight: 600,
                lineHeight: "33.6px",
                letterSpacing: "0.4px",
                fontFamily: "Lexend Deca, sans-serif",
                color: "black",
                textTransform: "none",
                fontStyle: "normal",
              }}
            >
              {capitalizeFirstLetter(userRole)} Login
            </Typography>
          </Box>

          {loginError && (
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
              }}
            >
              <strong>{loginError.title?.()}</strong>
              <br />
              {loginError.text()}
            </div>
          )}
          <form style={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                margin: "40px 0 40px 0",
              }}
            >
              <TextField
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  maxHeight: "56px",
                }}
                placeholder="example@gmail.com"
              />
              {emailError && (
                <p style={{ color: "red" }}>{emailError.text()}</p>
              )}
            </Box>
            <Box>
              <TextField
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  maxHeight: "56px",
                }}
                placeholder="Your Password"
              />
            </Box>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0.4px",
                fontFamily: "Lexend Deca, sans-serif",
                color: theme.palette.learner.main,
                textTransform: "none",
                fontStyle: "normal",
                textAlign: "right",
              }}
            >
              Forgot Password
            </Typography>

            <Box
              sx={{
                maxWidth: "158px",
                maxHeight: "62px",
                marginTop: "40px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onLogInClick}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.learner.main,
                }}
              >
                <Typography
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    lineHeight: "26.4px",
                    letterSpacing: "0.4px",
                    fontFamily: "Lexend Deca, sans-serif",
                    color: "white",
                    textTransform: "none",
                    fontStyle: "normal",
                  }}
                >
                  Login
                </Typography>
              </Button>
            </Box>
          </form>
        </Container>
      </Container>
    );
  };

  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
      }}
      disableGutters
    >
      {isDrawerComponent ? <DrawerComponent /> : <MainComponent />}
    </Container>
  );
};

export default LoginComponent;
