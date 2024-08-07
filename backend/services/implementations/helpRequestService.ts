/* eslint-disable class-methods-use-this */
import { IHelpRequestService } from "../interfaces/helpRequestService";
import MgHelpRequest, { HelpRequest } from "../../models/helprequest.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import {
  CreateHelpRequestDTO,
  HelpRequestDTO,
} from "../../types/helpRequestTypes";

const Logger = logger(__filename);

export class HelpRequestService implements IHelpRequestService {
  async getHelpRequests(userId: string): Promise<HelpRequestDTO[]> {
    try {
      const helpRequests = await MgHelpRequest.find({ facilitator: userId })
        .populate("learner", "firstName lastName")
        .populate({
          path: "unit",
          select: "displayIndex",
          populate: {
            path: "modules",
            model: "unit.modules",
            select: "displayIndex",
          },
        })
        .sort({
          createdAt: -1,
        });
      // need a learners tab
      // put the message in the tab
      // date of request
      // location of the request (get all the titles)
      return helpRequests;
    } catch (error) {
      Logger.error(
        `Failed to retrieve help requests. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createHelpRequest(
    helpRequest: CreateHelpRequestDTO,
  ): Promise<HelpRequestDTO> {
    let createdHelpRequest: HelpRequest;
    try {
      createdHelpRequest = await MgHelpRequest.create({ ...helpRequest });
    } catch (error) {
      Logger.error(
        `Failed to create help request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return createdHelpRequest;
  }
}
