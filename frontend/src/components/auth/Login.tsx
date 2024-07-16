import React, { useContext, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { Button, TextField, Typography, Container } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";


const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (!role || !["administrator", "facilitator", "learner"].includes(role)) {
    return <Redirect to={WELCOME_PAGE} />;
  }

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    const isUserVerified = user?.accessToken
      ? await authAPIClient.isUserVerified(email, user.accessToken)
      : null;
    if (!user || !isUserVerified) {
      // will need to change this for different errors
      // eslint-disable-next-line no-alert
      alert("Bad login, user not found");
      return;
    }
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      // change this later to not use an alert
      // eslint-disable-next-line no-alert
      alert(`Bad login. Expected ${user.role}, got ${role}`);
      return;
    }

    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    setAuthenticatedUser(user);
  };

  const onSignupClick = () => {
    history.push(`${SIGNUP_PAGE}?role=${role}`);
  };

  return (
    <Container style={{ textAlign: "center" }}>
      <Typography variant="h4">{capitalizeFirstLetter(role)} Login</Typography>
      <form>
        <div>
          <TextField
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            type="password"
            value={password}
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
      {role === "facilitator" && (
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
