import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationAPIClient from "../../../APIClients/NotificationAPIClient";
import { LANDING_PAGE } from "../../../constants/Routes";
import { useSocket } from "../../../contexts/SocketContext";
import { useUser } from "../../../hooks/useUser";
import { Notification } from "../../../types/NotificationTypes";
import eafLogo from "../../assets/logoColoured.png";
import NotifiactionsFetchError from "../../notification/NotificationsFetchError";
import NotificationList from "../../notification/NotificationsList";
import PageTabs from "./PageTabs";
import UserButton from "./UserButton";

export default function Navbar() {
  const user = useUser();
  const socket = useSocket();
  const theme = useTheme();

  const NUMBER_OF_NOTIFICATIONS_TO_LOAD = 10;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [numUnseenNotifications, setNumUnseenNotification] = useState(0);
  const [errorFetchNotifs, setErrorFetchNotifs] = useState(false);

  const fetchNotifications = async () => {
    const data = await NotificationAPIClient.getNotifications(
      0, // Always start from the beginning
      NUMBER_OF_NOTIFICATIONS_TO_LOAD,
    );
    if (!data) {
      setErrorFetchNotifs(true);
      return;
    }
    setNotifications(data.notifications);
    setNumUnseenNotification(data.numberOfUnseenNotifications);
    setErrorFetchNotifs(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification:new", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setNumUnseenNotification((prev) => prev + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    socket.on("notification:readUpdates", (updates) => {
      setNumUnseenNotification(0);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("notification:new");
      socket.off("notification:readUpdates");
    };
  }, [socket]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    socket?.emit("notification:read", user.id);
    fetchNotifications();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            <PageTabs />
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
        {errorFetchNotifs ? (
          <NotifiactionsFetchError />
        ) : (
          <NotificationList
            notifications={notifications}
            refreshNotifs={fetchNotifications}
          />
        )}
      </Popover>
    </Box>
  );
}
