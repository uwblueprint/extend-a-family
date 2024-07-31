import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, TextField, Typography, Container } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

interface LoginProps {
  userRole: string;
  align?: "left" | "center" | "right";  // Restrict to valid values
}

const Login: React.FC<LoginProps> = ({
  userRole,
  align = "left" // Default to "left" alignment
}: LoginProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (!userRole || !["administrator", "facilitator", "learner"].includes(userRole)) {
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
    if (user.role.toLowerCase() !== userRole.toLowerCase()) {
      // change this later to not use an alert
      // eslint-disable-next-line no-alert
      alert(`Bad login. Expected ${user.role}, got ${userRole}`);
      return;
    }

    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    setAuthenticatedUser(user);
  };

  const onSignupClick = () => {
    history.push(`${SIGNUP_PAGE}?role=${userRole}`);
  };

  return (
    <Container style={{ textAlign: align }}>
      <Typography variant="h4">{capitalizeFirstLetter(userRole)} Login</Typography>
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
      {userRole === "facilitator" && (
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
