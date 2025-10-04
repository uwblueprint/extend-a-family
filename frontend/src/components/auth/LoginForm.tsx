import { AlternateEmail, Password } from "@mui/icons-material";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useContext, useState } from "react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { FORGOT_PASSWORD_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import {
  AuthErrorCodes,
  authErrors,
  defaultAuthError,
} from "../../errors/AuthErrors";
import { AuthenticatedUser, AuthError, Role } from "../../types/AuthTypes";
import { PresentableError } from "../../types/ErrorTypes";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import ErrorAlert from "../common/ErrorAlert";

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
  const [passwordError, setPasswordError] = useState<PresentableError>();
  const [errorData, setErrorData] =
    useState<[string | undefined, string | undefined]>();

  const theme = useTheme();

  const onLogInClick = async () => {
    try {
      setLoginError(undefined);
      setEmailError(undefined);
      setPasswordError(undefined);
      setErrorData([undefined, undefined]);
      const user: AuthenticatedUser | null = await authAPIClient.login(
        email,
        password,
        userRole,
      );

      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
      setAuthenticatedUser(user);
    } catch (e: unknown) {
      const error = e as Error;
      const errorCause = error.cause as AuthError;
      switch (error.message) {
        case AuthErrorCodes.UNVERIFIED_EMAIL:
          setLoginError(authErrors[AuthErrorCodes.UNVERIFIED_EMAIL]);
          break;
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
          setLoginError(authErrors[AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]);
          break;
        case AuthErrorCodes.WRONG_USER_TYPE:
          setLoginError(authErrors[AuthErrorCodes.WRONG_USER_TYPE]);
          setErrorData([errorCause.errorData?.[0], errorCause.errorData?.[1]]);
          break;
        case AuthErrorCodes.EMAIL_NOT_FOUND:
          setEmailError(authErrors[AuthErrorCodes.EMAIL_NOT_FOUND]);
          break;
        case AuthErrorCodes.INCORRECT_PASSWORD:
          setPasswordError(authErrors[AuthErrorCodes.INCORRECT_PASSWORD]);
          break;
        default:
          setLoginError(defaultAuthError);
      }
    }
  };

  return (
    <Box>
      {loginError && (
        <Box
          sx={{
            marginBottom: "40px",
          }}
        >
          <ErrorAlert
            title={loginError.title?.()}
            message={
              errorData?.[0] && errorData?.[1]
                ? loginError?.text(errorData[0], errorData[1])
                : loginError?.text()
            }
          />
        </Box>
      )}

      <Typography
        variant="headlineLarge"
        sx={{
          color: theme.palette.Neutral[700],
          display: "flex",
          justifyContent: isDrawerLogin(userRole) ? "center" : "left",
        }}
      >
        {capitalizeFirstLetter(userRole)} Login
      </Typography>

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
              error={!!emailError}
              helperText={emailError?.text()}
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
                "& .MuiFormHelperText-root": {
                  color: theme.palette.Error.Dark.Default,
                },
              }}
            />
          </Box>
          <Box>
            <TextField
              required
              error={!!passwordError}
              helperText={passwordError?.text()}
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
                "& .MuiFormHelperText-root": {
                  color: theme.palette.Error.Dark.Default,
                },
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
                    color: passwordError
                      ? theme.palette.Error.Dark.Default
                      : theme.palette[userRole].Dark.Default,
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
              backgroundColor: theme.palette[userRole].Dark.Default,
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
