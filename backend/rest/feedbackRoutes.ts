import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import FeedbackService from "../services/implementations/feedbackService";
import { isAuthorizedByRole } from "../middlewares/auth";
import { createFeedbackDtoValidator } from "../middlewares/validators/feedbackValidator";

const feedbackRouter: Router = Router();

const feedbackService = new FeedbackService();

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
      const newFeedback = await feedbackService.createFeedback({
        learnerId: req.body.learnerId,
        moduleId: req.body.moduleId,
        unitId: req.body.unitId,
        isLiked: req.body.isLiked,
        difficulty: req.body.difficulty,
        message: req.body.message,
      });
      res.status(201).json(newFeedback);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

export default feedbackRouter;
