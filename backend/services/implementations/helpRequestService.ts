/* eslint-disable class-methods-use-this */
import { IHelpRequestService } from "../interfaces/helpRequestService";
import MgHelpRequest, { HelpRequest } from "../../models/helprequest.mgmodel";
import MgNotification from "../../models/notification.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import {
  CreateHelpRequestDTO,
  HelpRequestDTO,
} from "../../types/helpRequestTypes";

const Logger = logger(__filename);

export class HelpRequestService implements IHelpRequestService {
  async getHelpRequests(): Promise<HelpRequestDTO[]> {
    try {
      const helpRequests = await MgHelpRequest.find();
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
