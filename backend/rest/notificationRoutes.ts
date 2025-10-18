import { Router } from "express";
import { getAccessToken, isAuthorizedByRole } from "../middlewares/auth";
import { getNotificationtDtoValidator } from "../middlewares/validators/notificationValidator";
import AuthService from "../services/implementations/authService";
import NotificationService from "../services/implementations/notificationService";
import UserService from "../services/implementations/userService";
import { getErrorMessage } from "../utilities/errorUtils";

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

notificationRouter.post(
  "/markRead/:notifId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    try {
      const result = await notificationService.markNotificationRead(
        req.params.notifId,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

export default notificationRouter;
