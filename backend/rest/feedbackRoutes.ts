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
