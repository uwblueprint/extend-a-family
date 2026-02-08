import { Box, IconButton, Popover, useTheme } from "@mui/material";
import React from "react";
import { useUser } from "../../../hooks/useUser";
import Logout from "../../auth/Logout";
import MyAccountButton from "../../auth/MyAccountButton";
import ResetPassword from "../../auth/ResetPassword";
import ProfilePicture from "../../profile/ProfilePicture";

const UserButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const theme = useTheme();
  const { profilePicture } = useUser();

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
        onClick={handleClick}
        sx={{ color: theme.palette.Neutral[400] }}
      >
        <ProfilePicture size={24} sourceUrl={profilePicture} />
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
          <ResetPassword />
          <Logout />
        </Box>
      </Popover>
    </>
  );
};

export default UserButton;
