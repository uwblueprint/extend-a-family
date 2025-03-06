import React, { useContext } from "react";

import { Button } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const onRefreshClick = async () => {
    const success = await authAPIClient.refresh();
    if (!success) {
      setAuthenticatedUser(null);
    }
  };

  return <Button onClick={onRefreshClick}>Refresh Credentials</Button>;
};

export default RefreshCredentials;
