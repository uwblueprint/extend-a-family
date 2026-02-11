import { AccountCircle } from "@mui/icons-material";
import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Routes from "../../constants/Routes";
import { useUser } from "../../hooks/useUser";

const MyAccountButton = (): React.ReactElement => {
  const history = useHistory();
  const { role } = useUser();
  const theme = useTheme();
  return (
    <Button
      onClick={() => history.push(Routes.MY_ACCOUNT_PAGE)}
      sx={{ color: theme.palette[role].Dark.Default }}
    >
      <Box sx={{ display: "flex", alignContent: "flex-start" }}>
        <AccountCircle sx={{ mr: 1 }} /> My Account
      </Box>
    </Button>
  );
};

export default MyAccountButton;
