import React from "react";
import { AccountCircle } from "@mui/icons-material";
import { Box, IconButton, Popover } from "@mui/material";
import RefreshCredentials from "../../auth/RefreshCredentials";
import ResetPassword from "../../auth/ResetPassword";
import Logout from "../../auth/Logout";
import MyAccountButton from "../../auth/MyAccountButton";

const UserButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <AccountCircle />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box display="flex" sx={{ flexDirection: "column" }}>
          <MyAccountButton />
          <Logout />
          <RefreshCredentials />
          <ResetPassword />
        </Box>
      </Popover>
    </>
  );
};

export default UserButton;
