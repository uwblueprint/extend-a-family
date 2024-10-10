/* eslint-disable no-underscore-dangle */
import { Router } from "express";
import { getErrorMessage } from "../utilities/errorUtils";
import { HelpRequestService } from "../services/implementations/helpRequestService";
import MgNotification from "../models/notification.mgmodel";
import {
  createHelpRequestDtoValidator,
  updateHelpRequestDtoValidator,
} from "../middlewares/validators/helpRequestValidators";
import { getAccessToken } from "../middlewares/auth";
import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";

const helpRequestRouter: Router = Router();

const helpRequestService = new HelpRequestService();
const authService = new AuthService(new UserService());

helpRequestRouter.get("/", async (req, res) => {
  const accessToken = getAccessToken(req);
  try {
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }
    const userId = await authService.getUserIdFromAccessToken(accessToken);
    const helpRequests = await helpRequestService.getHelpRequests(userId);
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

helpRequestRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const accessToken = getAccessToken(req);
  try {
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }
    const userId = await authService.getUserIdFromAccessToken(accessToken);
    const helpRequest = await helpRequestService.getHelpRequest(id, userId);
    res.status(200).json(helpRequest);
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
      message: req.body.message,
      user: req.body.facilitator,
      link: `/help-requests/${createdHelpRequest.id}`,
    });

    res.status(201).send(createdHelpRequest);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

helpRequestRouter.put(
  "/:id",
  updateHelpRequestDtoValidator,
  async (req, res) => {
    const { id } = req.params;
    try {
      const updatedHelpRequest = await helpRequestService.updateHelpRequest(
        id,
        {
          unit: req.body.unit,
          module: req.body.module,
          page: req.body.page,
          completed: req.body.completed,
        },
      );
      res.status(201).send(updatedHelpRequest);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

export default helpRequestRouter;
