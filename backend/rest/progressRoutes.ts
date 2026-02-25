import { Router, Request, Response } from "express";
import { getAccessToken, isAuthorizedByRole } from "../middlewares/auth";
import LearnerProgressService from "../services/implementations/learnerProgressService";
import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";
import { getErrorMessage } from "../utilities/errorUtils";

const progressRouter: Router = Router();

const userService = new UserService();
const emailService = new EmailService(nodemailerConfig);
const authService = new AuthService(userService, emailService);
const progressService = new LearnerProgressService();

/**
 * POST /progress/activity/complete
 * Mark an activity as completed for the current learner.
 * Body: { activityId: string, moduleId: string }
 */
progressRouter.post(
  "/activity/complete",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);
    const { activityId, moduleId } = req.body;

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      if (!activityId || !moduleId) {
        res.status(400).json({ error: "activityId and moduleId are required" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const result = await progressService.completeActivity(
        learnerId.toString(),
        activityId,
        moduleId,
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * GET /progress/activity/:activityId
 * Check if a specific activity is completed by the current learner.
 */
progressRouter.get(
  "/activity/:activityId",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);
    const { activityId } = req.params;

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const isCompleted = await progressService.isActivityCompleted(
        learnerId.toString(),
        activityId,
      );

      res.status(200).json({ activityId, isCompleted });
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * GET /progress/module/:moduleId
 * Get progress information for a specific module.
 */
progressRouter.get(
  "/module/:moduleId",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);
    const { moduleId } = req.params;

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const moduleProgress = await progressService.getModuleProgress(
        learnerId.toString(),
        moduleId,
      );

      res.status(200).json(moduleProgress);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * GET /progress/course
 * Get overall course progress for the current learner.
 */
progressRouter.get(
  "/course",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const courseProgress = await progressService.getCourseProgress(
        learnerId.toString(),
      );

      res.status(200).json(courseProgress);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * POST /progress/page/view
 * Update the last viewed page for the current learner.
 * Body: { moduleId: string, pageId: string }
 */
progressRouter.post(
  "/page/view",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);
    const { moduleId, pageId } = req.body;

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      if (!moduleId || !pageId) {
        res.status(400).json({ error: "moduleId and pageId are required" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const progress = await progressService.updateLastViewedPage(
        learnerId.toString(),
        { moduleId, pageId },
      );

      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * GET /progress/page/last-viewed
 * Get the last viewed page for the current learner.
 */
progressRouter.get(
  "/page/last-viewed",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const lastViewedPage = await progressService.getLastViewedPage(
        learnerId.toString(),
      );

      if (!lastViewedPage) {
        res.status(200).json({ message: "No page viewed yet" });
        return;
      }

      res.status(200).json(lastViewedPage);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/**
 * GET /progress
 * Get the full progress record for the current learner.
 */
progressRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const accessToken = getAccessToken(req);

    try {
      if (!accessToken) {
        res
          .status(401)
          .json({ error: "Unauthorized: No access token provided" });
        return;
      }

      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const progress = await progressService.getOrCreateProgress(
        learnerId.toString(),
      );

      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default progressRouter;
