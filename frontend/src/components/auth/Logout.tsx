import React, { useContext } from "react";

import { Button } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const Logout = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  return <Button onClick={onLogOutClick}>Log Out</Button>;
};

export default Logout;
