import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AlternateEmail, Password } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser, Role } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { authErrors } from "../../errors/AuthErrors";
import { PresentableError } from "../../types/ErrorTypes";
import { PaletteRole } from "../../theme/theme";

interface LoginProps {
  userRole: Role;
  isDrawerComponent: boolean;
  signUpPrompt?: string;
  signUpPath?: string;
}
const Login: React.FC<LoginProps> = ({
  userRole,
  isDrawerComponent,
  signUpPrompt,
  signUpPath,
}: LoginProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState<PresentableError>();
  const [emailError, setEmailError] = useState<PresentableError>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDrawerLogin, setShowDrawerLogin] = useState<boolean>(true);

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

  const handleTextClick = () => {
    setShowDrawerLogin(false);
  };

  const redirectSignUpPath = (): boolean => {
    if (signUpPath) {
      return !!signUpPrompt;
    }
    return false;
  };

  interface InfoTextProps {
    title: string;
    description: string;
  }
  const InfoText: React.FC<InfoTextProps> = ({ title, description }) => {
    return (
      <Box>
        <Box>
          <Typography
            variant="headlineLarge"
            style={{
              color: "#390C00",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box marginTop="12px">
          <Typography
            variant="bodyMedium"
            style={{
              color: "#390C00",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    );
  };

  const DrawerComponent = () => {
    return (
      <Container
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "80px 80px 80px 80px",
          flexDirection: "column",
          justifyContent: "center",
        }}
        disableGutters
      >
        {showDrawerLogin && (
          <Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="headlineLarge"
                style={{
                  color: "black",
                }}
              >
                {capitalizeFirstLetter(userRole)} Login
              </Typography>
            </Box>
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
              <Box
                sx={{
                  margin: "40px 0 40px 0",
                }}
              >
                <TextField
                  required
                  label="Email"
                  type="email"
                  InputProps={{
                    sx: {
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "22.4px",
                      letterSpacing: "0.2px",
                      fontFamily: "Lexend Deca, sans-serif",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="example@gmail.com"
                  onChange={(event) => setEmail(event.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="none"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    maxHeight: "56px",
                  }}
                />
                {emailError && (
                  <p style={{ color: "red" }}>{emailError.text()}</p>
                )}
              </Box>
              <Box
                sx={{
                  marginBottom: "8px",
                }}
              >
                <TextField
                  required
                  label="Password"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="none"
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
                  placeholder="Your Password"
                />
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="bodySmall"
                  style={{
                    color:
                      theme.palette[userRole.toLowerCase() as PaletteRole]
                        ?.main || "primary",
                  }}
                >
                  Forgot Password
                </Typography>
              </Box>
            </form>
            <Box
              sx={{
                width: "100%",
                height: "59px",
                marginTop: "40px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onLogInClick}
                style={{
                  height: "59px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor:
                    theme.palette[userRole.toLowerCase() as PaletteRole]
                      ?.main || "primary",
                  marginBottom: "20px",
                  boxShadow: "none",
                }}
              >
                <Typography
                  variant="labelLargeProminent"
                  style={{
                    color: "white",
                  }}
                >
                  Login as {userRole}
                </Typography>
              </Button>
              {redirectSignUpPath() && (
                <Box sx={{ textAlign: "center" }}>
                  <Link
                    to={signUpPath as string}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="labelSmall"
                      style={{
                        color:
                          theme.palette[userRole.toLowerCase() as PaletteRole]
                            ?.main || "primary",
                      }}
                    >
                      {signUpPrompt}
                    </Typography>
                  </Link>
                </Box>
              )}
              {!redirectSignUpPath() && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="labelSmall"
                    style={{
                      color:
                        theme.palette[userRole.toLowerCase() as PaletteRole]
                          ?.main || "primary",
                    }}
                    onClick={handleTextClick}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {signUpPrompt}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {!showDrawerLogin && (
          <InfoText
            title="Contact an administrator"
            description="Please contact an existing administrator to set up your account."
          />
        )}
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
        <Box
          style={{
            width: "100%",
            maxHeight: "254px",
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            alignSelf: "stretch",
          }}
        >
          <Box>
            <Typography variant="headlineLarge" style={{ color: "black" }}>
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
                required
                label="Email"
                type="email"
                InputProps={{
                  sx: {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "22.4px",
                    letterSpacing: "0.2px",
                    fontFamily: "Lexend Deca, sans-serif",
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail />
                    </InputAdornment>
                  ),
                }}
                placeholder="example@gmail.com"
                onChange={(event) => setEmail(event.target.value)}
                variant="outlined"
                fullWidth
                margin="none"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  maxHeight: "56px",
                }}
              />
              {emailError && (
                <p style={{ color: "red" }}>{emailError.text()}</p>
              )}
            </Box>
            <Box
              sx={{
                marginBottom: "8px",
              }}
            >
              <TextField
                required
                label="Password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                fullWidth
                margin="none"
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
                placeholder="Your Password"
              />
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="bodySmall"
                style={{
                  color: theme.palette.learner.main,
                }}
              >
                Forgot Password
              </Typography>
            </Box>
          </form>
          <Box
            sx={{
              width: "158px",
              height: "62px",
              marginTop: "40px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onLogInClick}
              style={{
                height: "62px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px",
                backgroundColor: theme.palette.learner.main,
                boxShadow: "none",
              }}
            >
              <Typography
                variant="headlineSmall"
                style={{
                  color: "white",
                }}
              >
                Login
              </Typography>
            </Button>
          </Box>
        </Box>
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

export default Login;
