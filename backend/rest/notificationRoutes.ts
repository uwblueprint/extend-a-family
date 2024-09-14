import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import NotificationService from "../services/implementations/notificationService";
import { getAccessToken } from "../middlewares/auth";
import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import { getNotificationtDtoValidator } from "../middlewares/validators/notificationValidator";

const notificationRouter: Router = Router();

const notificationService = new NotificationService();
const authService = new AuthService(new UserService());

notificationRouter.post("/", getNotificationtDtoValidator, async (req, res) => {
  const { skip, limit } = req.body;
  const accessToken = getAccessToken(req);
  try {
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }
    const userId = await authService.getUserIdFromAccessToken(accessToken);
    const data = await notificationService.getNotifications(
      userId,
      skip,
      limit,
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

export default notificationRouter;
