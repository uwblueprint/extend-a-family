import LogoutIcon from "@mui/icons-material/Logout";
import React, { useContext } from "react";

import { Button, useTheme } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const Logout = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const theme = useTheme();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <Button
      onClick={onLogOutClick}
      sx={{ color: theme.palette.Error.Dark.Default }}
    >
      <LogoutIcon sx={{ mr: 1 }} /> Log Out
    </Button>
  );
};

export default Logout;
