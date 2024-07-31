import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import {
  CREATE_PASSWORD_PAGE,
  NOT_AUTHORIZED_PAGE,
  WELCOME_PAGE,
} from "../../constants/Routes";
import { Role } from "../../types/AuthTypes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
  allowedRoles: Role[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
  allowedRoles,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser) {
    if (
      authenticatedUser.status === "Invited" &&
      path !== CREATE_PASSWORD_PAGE
    ) {
      return <Redirect to={CREATE_PASSWORD_PAGE} />;
    }
    return allowedRoles.includes(authenticatedUser.role) ? (
      <Route path={path} exact={exact} component={component} />
    ) : (
      <Redirect to={NOT_AUTHORIZED_PAGE} />
    );
  }
  return <Redirect to={WELCOME_PAGE} />;
};

export default PrivateRoute;
