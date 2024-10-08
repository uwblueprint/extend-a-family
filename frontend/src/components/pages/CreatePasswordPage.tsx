import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";
import AuthAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

const CreatePasswordPage = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const history = useHistory();

  if (authenticatedUser?.status !== "Invited") {
    return <Redirect to={HOME_PAGE} />;
  }

  const onSubmitNewPasswordClick = async () => {
    const changePasswordSuccess = await AuthAPIClient.updateTemporaryPassword(
      authenticatedUser.email,
      newPassword,
      authenticatedUser.role,
    );
    if (!changePasswordSuccess) {
      setAuthenticatedUser(null);
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
      await AuthAPIClient.logout(authenticatedUser.id);

      // change this later to not use an alert
      // eslint-disable-next-line no-alert
      alert("Error occurred when changing your password. Please log in again.");
      return;
    }

    const updateStatusSuccess = await AuthAPIClient.updateUserStatus("Active");
    if (!updateStatusSuccess) {
      // change this later to not use an alert
      // eslint-disable-next-line no-alert
      alert('Failed to update user status to "Active"');
      return;
    }

    setAuthenticatedUser({
      ...authenticatedUser,
      status: "Active",
    });

    history.push(HOME_PAGE);
  };

  return (
    <div style={{ textAlign: "center", padding: "1em" }}>
      <h1>Choose a New Password</h1>
      <div style={{ marginBottom: "0.5em" }}>
        Since this is your first time logging in, please choose a new password.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5em",
          justifyContent: "center",
        }}
      >
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="New Password"
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={onSubmitNewPasswordClick}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default CreatePasswordPage;
