import React from "react";
import { useHistory } from "react-router-dom";
import * as Routes from "../../constants/Routes";

const MyAccountButton = (): React.ReactElement => {
  const history = useHistory();
  return (
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => history.push(Routes.MY_ACCOUNT_PAGE)}
    >
      My Account
    </button>
  );
};

export default MyAccountButton;
