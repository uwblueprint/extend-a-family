import React from "react";
import { Redirect } from "react-router-dom";
import { LANDING_PAGE } from "../../constants/Routes";

const NotAuthorized = (): React.ReactElement => {
  return <Redirect to={LANDING_PAGE} />;
};

export default NotAuthorized;
