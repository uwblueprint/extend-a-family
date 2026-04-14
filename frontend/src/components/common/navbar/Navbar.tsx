import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { Link } from "react-router-dom";
import { LANDING_PAGE } from "../../../constants/Routes";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useSocket } from "../../../contexts/SocketContext";
import { useUser } from "../../../hooks/useUser";
import eafLogo from "../../assets/logoColoured.png";
import NotificationList from "../../notification/NotificationsList";
import PageTabs from "./PageTabs";
import UserButton from "./UserButton";

export default function Navbar() {
  const user = useUser();
  const theme = useTheme();
  const socket = useSocket();

  // const handleSkipToMainContent = (
  //   event: React.MouseEvent<HTMLAnchorElement>,
  // ) => {
  //   event.preventDefault();
  //   const mainContent = document.querySelector<HTMLElement>(
  //     "#main-content, main, [role='main']",
  //   );

  //   if (!mainContent) {
  //     return;
  //   }

  //   if (!mainContent.hasAttribute("tabindex")) {
  //     mainContent.setAttribute("tabindex", "-1");
  //   }

  //   if (!mainContent.id) {
  //     mainContent.id = "main-content";
  //   }

  //   mainContent.focus();
  //   mainContent.scrollIntoView({ block: "start" });
  // };

  const {
    notifications,
    numUnseenNotifications,
    errorFetchNotifs,
    fetchNotifications,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (errorFetchNotifs) {
      fetchNotifications();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    socket?.emit("notification:seen", user.id);
    fetchNotifications();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <Box
        component="a"
        href="#main-content"
        onClick={handleSkipToMainContent}
        sx={{
          position: "absolute",
          top: "-100px",
          left: 0,
          zIndex: theme.zIndex.tooltip,
          px: 2,
          py: 1,
          borderRadius: "0 0 8px 0",
          bgcolor: theme.palette.Neutral[100],
          color: theme.palette.Facilitator.Dark.Default,
          border: `2px solid ${theme.palette.Facilitator.Dark.Default}`,
          textDecoration: "none",
          fontWeight: 700,
          transition: "top 0.2s ease",
          "&:focus": {
            top: 0,
          },
        }}
      >
        Skip to main content
      </Box> */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: theme.palette.Neutral[100],
          borderBottom: "2px solid #EEE",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ padding: 0, height: "40px" }}>
          <Link to={LANDING_PAGE}>
            <img
              src={eafLogo}
              alt="Extend-A-Family logo"
              style={{ height: "40px" }}
            />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: "24px" }}>
            {user.role === "Facilitator" && (
              <IconButton
                size="large"
                aria-label="show new notifications"
                onClick={handleClick}
                sx={{ color: theme.palette.Facilitator.Light.Hover }}
              >
                <Badge badgeContent={numUnseenNotifications} color="error">
                  <MessageOutlinedIcon
                    sx={{
                      width: "24px",
                      height: "24px",
                      color: theme.palette.Facilitator.Dark.Default,
                    }}
                  />
                </Badge>
              </IconButton>
            )}
            <PageTabs />
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NotificationList
          notifications={notifications.filter((notif) => !notif.read)}
          refreshNotifs={fetchNotifications}
          errorFetchNotifs={errorFetchNotifs}
        />
      </Popover>
    </Box>
  );
}
