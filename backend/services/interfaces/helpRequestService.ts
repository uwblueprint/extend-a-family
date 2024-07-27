import {
  HelpRequestDTO,
  CreateHelpRequestDTO,
} from "../../types/helpRequestTypes";

export interface IHelpRequestService {
  /**
   * Gets all help requests (will be able to filter in future if needed)
   */
  getHelpRequests(): Promise<HelpRequestDTO[]>;

  /**
   * Creates a help request
   * @param helpRequest the help request to be created
   */
  createHelpRequest(helpRequest: CreateHelpRequestDTO): Promise<HelpRequestDTO>;
}
