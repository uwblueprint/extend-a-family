import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import FeedbackService from "../services/implementations/feedbackService";
import { getAccessToken } from "../middlewares/auth";
import { getFeedbackDtoValidator } from "../middlewares/validators/feedbackValidator";

const feedbackRouter: Router = Router();

const feedbackService = new FeedbackService();

/* 
Get a Feedback by its ID 
- requires feedbackId in request query 
- Ex. /feedbacks/?feedbackId=67a161bf247f830154519e69
*/
feedbackRouter.get("/", async (req, res) => {
  const accessToken = getAccessToken(req);
  try {
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }

    const feedbackId = req.query.feedbackId as string;
    const data = await feedbackService.getFeedbackById(feedbackId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

/* 
Create a Feedback 
*/
feedbackRouter.post("/", getFeedbackDtoValidator, async (req, res) => {
  const accessToken = getAccessToken(req);
  try {
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }
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
});

export default feedbackRouter;
