import React, { useContext } from "react";

import { Button } from "@mui/material";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const onResetPasswordClick = async () => {
    if (!authenticatedUser?.email) {
      return;
    }
    await authAPIClient.resetPassword(authenticatedUser.email);
  };

  return <Button onClick={onResetPasswordClick}>Reset Password</Button>;
};

export default ResetPassword;
