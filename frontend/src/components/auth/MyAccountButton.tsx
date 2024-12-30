import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import * as Routes from "../../constants/Routes";

const MyAccountButton = (): React.ReactElement => {
  const history = useHistory();
  return (
    <Button onClick={() => history.push(Routes.MY_ACCOUNT_PAGE)}>
      My Account
    </Button>
  );
};

export default MyAccountButton;
