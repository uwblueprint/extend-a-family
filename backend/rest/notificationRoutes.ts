import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import NotificationService from "../services/implementations/notificationService";

const notificationRouter: Router = Router();

const notificationService = new NotificationService();

notificationRouter.get("/", async (req, res) => {
  const { user, skip, limit } = req.query;
  try {
    if (!user) {
      res.status(400).send("User id must be provided");
      return;
    }
    const data = await notificationService.getNotifications(
      user as string,
      parseInt(skip as string, 10),
      parseInt(limit as string, 10),
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

export default notificationRouter;
