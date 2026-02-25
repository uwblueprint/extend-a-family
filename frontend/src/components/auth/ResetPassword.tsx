import React, { useContext } from "react";

import { LockReset } from "@mui/icons-material";
import { Button, useTheme } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const theme = useTheme();

  const onResetPasswordClick = async () => {
    if (!authenticatedUser?.email) {
      return;
    }
    await authAPIClient.resetPassword(authenticatedUser.email);
  };

  return (
    <Button
      onClick={onResetPasswordClick}
      sx={{ color: theme.palette.Neutral[600] }}
    >
      <LockReset sx={{ mr: 1 }} /> Reset Password
    </Button>
  );
};

export default ResetPassword;
