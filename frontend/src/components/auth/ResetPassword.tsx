import React, { useContext } from "react";

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

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onResetPasswordClick}
    >
      Reset Password
    </button>
  );
};

export default ResetPassword;
