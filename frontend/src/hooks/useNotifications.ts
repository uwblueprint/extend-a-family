import { useEffect, useState } from "react";
import NotificationAPIClient from "../APIClients/NotificationAPIClient";
import { useSocket } from "../contexts/SocketContext";
import { Notification } from "../types/NotificationTypes";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [numUnseenNotifications, setNumUnseenNotification] = useState(0);
  const [errorFetchNotifs, setErrorFetchNotifs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const NUMBER_OF_NOTIFICATIONS_TO_LOAD = 10;

  const socket = useSocket();

  const fetchNotifications = async () => {
    setIsLoading(true);
    const data = await NotificationAPIClient.getNotifications(
      0, // Always start from the beginning
      NUMBER_OF_NOTIFICATIONS_TO_LOAD,
    );
    setIsLoading(false);
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

  return {
    notifications,
    numUnseenNotifications,
    isLoading,
    errorFetchNotifs,
    fetchNotifications,
  };
};

export default useNotifications;
