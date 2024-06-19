import React, { useContext, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, WELCOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();

  // Extract query parameters from the URL
  const params = new URLSearchParams(location.search);
  const role = params.get("role");

  if (role !== "facilitator") {
    return <Redirect to={HOME_PAGE} />;
  }

  const onSignupClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.signup(
      firstName,
      lastName,
      email,
      password,
      capitalizeFirstLetter(role),
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={WELCOME_PAGE} />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{capitalizeFirstLetter(role)} Signup</h1>
      <form>
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="first name"
          />
        </div>
        <div>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="last name"
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
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
            onClick={onSignupClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
