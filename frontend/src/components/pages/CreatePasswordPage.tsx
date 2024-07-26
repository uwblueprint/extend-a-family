import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { HOME_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const CreatePasswordPage = (): React.ReactElement => {
    const { authenticatedUser } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState("");
    const history = useHistory();

    if (authenticatedUser?.status !== "Invited") {
        console.log("Not a newly invited user")
        return <Redirect to={HOME_PAGE} />
    }

    const onSubmitNewPasswordClick = async () => {
        const success = await AuthAPIClient.updateTemporaryPassword(newPassword);
        console.log("Completed:", success)
        if (success) {
            // change this later to not use an alert
            // eslint-disable-next-line no-alert
            alert("Successfully changed your password. Please log in with your new credentials.");
        } else {
            // change this later to not use an alert
            // eslint-disable-next-line no-alert
            alert("Error occurred when changing your password. Please try again later.");
            await AuthAPIClient.logout(authenticatedUser.id);
        }
        history.push(`${LOGIN_PAGE}?role=${authenticatedUser.role}`);
    }

    return (
        <div style={{ textAlign: "center", padding: "1em" }}>
            <h1>Choose a New Password</h1>
            <div style={{ marginBottom: "0.5em" }}>
                Since this is your first time logging in, please choose a new password.
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5em",
                justifyContent: "center"
            }}>
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
