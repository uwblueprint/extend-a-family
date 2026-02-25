import { Router } from "express";
import { isAuthorizedByRole } from "../middlewares/auth";
import { createFeedbackDtoValidator } from "../middlewares/validators/feedbackValidator";
import FeedbackService from "../services/implementations/feedbackService";
import { getErrorMessage } from "../utilities/errorUtils";

const feedbackRouter: Router = Router();

const feedbackService = new FeedbackService();

/*
Get all feedback objects
*/
feedbackRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator"])),
  async (req, res) => {
    try {
      const data = await feedbackService.getAllFeedback();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

/* 
Check if a learner has already submitted feedback for a module
- requires moduleId and learnerId in query params
- Ex. /feedbacks/check?moduleId=123&learnerId=456
*/
feedbackRouter.get(
  "/check",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req, res) => {
    try {
      const { moduleId, learnerId } = req.query;
      if (!moduleId || !learnerId) {
        res.status(400).send("moduleId and learnerId are required");
        return;
      }
      const hasFeedback = await feedbackService.hasFeedback(
        learnerId as string,
        moduleId as string,
      );
      res.status(200).json({ hasFeedback });
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

/* 
Get a Feedback by its ID 
- requires feedbackId in request params 
- Ex. /feedbacks/67a161bf247f830154519e69
*/
feedbackRouter.get(
  "/:feedbackId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator"])),
  async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId as string;
      const data = await feedbackService.getFeedbackById(feedbackId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

/* 
Create a Feedback 
*/
feedbackRouter.post(
  "/",
  isAuthorizedByRole(new Set(["Learner"])),
  createFeedbackDtoValidator,
  async (req, res) => {
    try {
      const { learnerId, moduleId, isLiked, difficulty, message } = req.body;

      const newFeedback = await feedbackService.createFeedback({
        learnerId,
        moduleId,
        isLiked,
        difficulty,
        message,
      });
      res.status(201).json(newFeedback);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

export default feedbackRouter;
