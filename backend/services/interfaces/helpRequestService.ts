import { ObjectId } from "mongoose";
import {
  HelpRequestDTO,
  CreateHelpRequestDTO,
  UpdateHelpRequestDTO,
} from "../../types/helpRequestTypes";

export interface IHelpRequestService {
  /**
   * Get a singular help request
   * @param requestId the helprequest we want to find
   * @throws Error is helprequest with requestId doesn't exist
   * @throws Error is helprequest's faciliator id doesn't match with the user requesting it
   */
  getHelpRequest(requestId: string, userId: ObjectId): Promise<HelpRequestDTO>;

  /**
   * Gets all help requests (will be able to filter in future if needed)
   * @param userId the userid of the helprequests to find
   */
  getHelpRequests(userId: ObjectId): Promise<HelpRequestDTO[]>;

  /**
   * Creates a help request
   * @param helpRequest the help request to be created
   */
  createHelpRequest(helpRequest: CreateHelpRequestDTO): Promise<HelpRequestDTO>;
  /**
   *
   * @param requestId the helprequest we want to find
   * @param updates the updates that we want to make to the request
   * @throws Error is helprequest with requestId doesn't exist
   */
  updateHelpRequest(
    requestId: string,
    updates: UpdateHelpRequestDTO,
  ): Promise<HelpRequestDTO>;
}
