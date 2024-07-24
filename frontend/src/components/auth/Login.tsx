import React, { useContext, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { PresentableError } from "../../types/ErrorTypes";
import { authErrors, defaultAuthError } from "../../errors/AuthErrors";

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState<PresentableError>();
  const [emailError, setEmailError] = useState<PresentableError>();
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
    try {
      setLoginError(undefined);
      setEmailError(undefined);
      const user: AuthenticatedUser | null = await authAPIClient.login(
        email,
        password,
      );
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorCode = e.message;
        const errorContent = authErrors[errorCode] ?? defaultAuthError;
        if (errorCode === "EMAIL_NOT_FOUND") {
          setEmailError(errorContent);
        } else {
          setLoginError(errorContent);
        }
      }
    }
  };

  const onSignupClick = () => {
    history.push(`${SIGNUP_PAGE}?role=${role}`);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{capitalizeFirstLetter(role)} Login</h1>
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
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
          {emailError && <p style={{ color: "red" }}>{emailError.text()}</p>}
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onLogInClick}
          >
            Log In
          </button>
        </div>
      </form>
      {role === "facilitator" && (
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignupClick}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
