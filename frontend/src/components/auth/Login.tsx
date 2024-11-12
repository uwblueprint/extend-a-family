import React, { useContext, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { Button, TextField, Typography, Container } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { isRole } from "../../types/UserTypes";
import { PresentableError } from "../../types/ErrorTypes";
import { authErrors } from "../../errors/AuthErrors";

interface LoginProps {
  userRole: string;
  align?: "left" | "center" | "right"; // Restrict to valid values
}

const Login: React.FC<LoginProps> = ({
  userRole,
  align = "left", // Default to "left" alignment
}: LoginProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState<PresentableError>();
  const [emailError, setEmailError] = useState<PresentableError>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = capitalizeFirstLetter(searchParams.get("role"));

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (!role || !isRole(role)) {
    return <Redirect to={WELCOME_PAGE} />;
  }

  const onLogInClick = async () => {
    try {
      setLoginError(undefined);
      setEmailError(undefined);
      const user: AuthenticatedUser | null = await authAPIClient.login(
        email,
        password,
        role,
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

  const onSignupClick = () => {
    history.push(`${SIGNUP_PAGE}?role=${role.toLowerCase()}`);
    history.push(`${SIGNUP_PAGE}?role=${userRole}`);
  };

  return (
    <Container style={{ textAlign: align }} sx={{ height: "100%" }}>
      <Typography variant="h4">
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
      {role === "Facilitator" && (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={onSignupClick}
            fullWidth
          >
            Sign Up
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Login;
