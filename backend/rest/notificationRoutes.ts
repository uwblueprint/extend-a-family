import { Router } from "express";
import { Socket } from "socket.io";
import NotificationService from "../services/implementations/notificationService";
import { createNotificationsValidator } from "../middlewares/validators/notificationValidators";
import { getErrorMessage } from "../utilities/errorUtils";

const notificationRouter: Router = Router();

const notificationService = new NotificationService();

notificationRouter.get("/", async (req, res) => {
  const { user, start, limit } = req.query;
  if (!user) {
    res.status(400).json({ error: "An user is required" });
    return;
  }

  if (typeof user !== "string") {
    res.status(400).json({ error: "User needs to be a string" });
    return;
  }

  try {
    if (start && limit) {
      const notifications = await notificationService.getNotifications(
        user,
        0,
        10,
      );
      res.json(notifications);
    }
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

notificationRouter.post("/", createNotificationsValidator, async (req, res) => {
  const { user, message, link } = req.body;
  const io: Socket = req.app.get("io");
  try {
    const notification = await notificationService.createNotification({
      user,
      message,
      link,
    });
    // send noti to user
    io.to(user.id).emit(JSON.stringify({ message, link }));
    res.status(201).send(notification);
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});
