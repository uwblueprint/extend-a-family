import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import { HelpRequestService } from "../services/implementations/helpRequestService";
import MgNotification from "../models/notification.mgmodel";
import { createHelpRequestDtoValidator } from "../middlewares/validators/helpRequestValidators";

const helpRequestRouter: Router = Router();

const helpRequestService = new HelpRequestService();

helpRequestRouter.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      res
        .status(400)
        .json({ error: "userId query parameter must be provided." });
    } else if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string." });
    } else {
      const helpRequests = await helpRequestService.getHelpRequests(userId);
      res.status(200).json(helpRequests);
    }
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

helpRequestRouter.post("/", createHelpRequestDtoValidator, async (req, res) => {
  try {
    const createdHelpRequest = await helpRequestService.createHelpRequest({
      message: req.body.message,
      learner: req.body.learner,
      facilitator: req.body.facilitator,
      unit: req.body.unit,
      module: req.body.module,
      page: req.body.page,
    });
    // make and send a notificaiton to the facilitator
    await MgNotification.create({
      message: "genji",
      user: req.body.facilitator,
      read: false,
      link: "/",
    });

    res.status(201).send(createdHelpRequest);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

export default helpRequestRouter;
