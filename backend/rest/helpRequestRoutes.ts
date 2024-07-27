import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import { HelpRequestService } from "../services/implementations/helpRequestService";
import MgNotification from "../models/notification.mgmodel";

const helpRequestRouter: Router = Router();

const helpRequestService = new HelpRequestService();

helpRequestRouter.get("/", async (req, res) => {
  try {
    const helpRequests = await helpRequestService.getHelpRequests();
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

helpRequestRouter.post("/", async (req, res) => {
  try {
    const createdHelpRequest = await helpRequestService.createHelpRequest({
      message: req.body.message,
      learner: req.body.learner,
      facilitator: req.body.facilitator,
      unit: req.body.unit,
      module: req.body.module,
      page: req.body.page,
    });
    // send a notificaiton to the facilitator
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
