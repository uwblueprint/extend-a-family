import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AlternateEmail, Password } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { AuthenticatedUser, Role } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { PresentableError } from "../../types/ErrorTypes";
import { FORGOT_PASSWORD_PAGE } from "../../constants/Routes";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import { authErrors } from "../../errors/AuthErrors";
import { PaletteRole } from "../../theme/theme";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { neutral } from "../../theme/palette";

function isDrawerLogin(userRole: Role) {
  return userRole !== "Learner";
}

interface LoginFormProps {
  userRole: Role;
}

const LoginForm = ({ userRole }: LoginFormProps) => {
  const { setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState<PresentableError>();
  const [emailError, setEmailError] = useState<PresentableError>();

  const theme = useTheme();

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

  return (
    <Box>
      <Typography
        variant="headlineLarge"
        sx={{
          color: neutral[700],
          display: "flex",
          justifyContent: isDrawerLogin(userRole) ? "center" : "left",
        }}
      >
        {capitalizeFirstLetter(userRole)} Login
      </Typography>
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
        <Stack
          sx={{
            width: "100%",
            marginTop: "40px",
          }}
          spacing="40px"
        >
          <Box>
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
              value={email}
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
            {emailError && <p style={{ color: "red" }}>{emailError.text()}</p>}
          </Box>
          <Box>
            <TextField
              required
              label="Password"
              type="password"
              value={password}
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
            <Box sx={{ textAlign: "right" }}>
              <Link href={FORGOT_PASSWORD_PAGE} underline="none">
                <Typography
                  variant="bodySmall"
                  style={{
                    color:
                      theme.palette[userRole.toLowerCase() as PaletteRole].main,
                  }}
                >
                  Forgot Password
                </Typography>
              </Link>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onLogInClick}
            style={{
              height: "60px",
              width: isDrawerLogin(userRole) ? "100%" : "27%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              backgroundColor:
                theme.palette[userRole.toLowerCase() as PaletteRole]?.main ||
                "primary",
              boxShadow: "none",
            }}
          >
            <Typography
              variant={
                isDrawerLogin(userRole)
                  ? "labelLargeProminent"
                  : "headlineSmall"
              }
              sx={{ color: "white" }}
            >
              Login {isDrawerLogin(userRole) && `as ${userRole}`}
            </Typography>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
