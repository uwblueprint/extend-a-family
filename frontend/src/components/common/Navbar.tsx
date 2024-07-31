import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsList from "../notification/NotificationsList";
import NotificationAPIClient from "../../APIClients/NotificationAPIClient";
import { useUser } from "../../hooks/useUser";
import { Notification } from "../../types/NotificationTypes";
import { useSocket } from "../../contexts/SocketContext";

export default function Navbar() {
  const user = useUser();
  const socket = useSocket();

  const NUMBER_OF_NOTIFICATIONS_TO_LOAD = 10;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [numUnseenNotifications, setNumUnseenNotification] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await NotificationAPIClient.getNotifications(
        user.id,
        notifications.length,
        NUMBER_OF_NOTIFICATIONS_TO_LOAD,
      );
      if (!data) return;
      setNotifications((prev) => [...data.notifications, ...prev]);
      setNumUnseenNotification(data.numberOfUnseenNotifications);
    };
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification:new", (notification) => {
      console.log("new notification", notification);
      setNotifications((prev) => [notification, ...prev]);
      setNumUnseenNotification((prev) => prev + 1);
    });
    socket.on("notification:readUpdates", (updates) => {
      console.log("new notification", updates);
      setNumUnseenNotification((prev) => prev - updates.modifiedCount);
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
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Extend a family
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
              onClick={handleClick}
            >
              <Badge badgeContent={numUnseenNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
        <Typography sx={{ p: 2 }}>Notifications and stuff go here</Typography>
        <NotificationsList notifications={notifications} />
      </Popover>
    </Box>
  );
}
