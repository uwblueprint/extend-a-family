import React, { useState } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
// import { AuthenticatedUser } from "../../types/AuthTypes";
// import AuthContext from "../../contexts/AuthContext";

const ForgotPasswordPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");

  const onResetPasswordClick = async () => {
    await authAPIClient.resetPassword(email);
  };

  return (
    <div>
      <div>Header</div>
      <div>Text</div>

      <form>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@gmail.com"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onResetPasswordClick}
          >
            Send reset link to email
          </button>
        </div>
      </form>
      <div>
        <div>remember your password</div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
