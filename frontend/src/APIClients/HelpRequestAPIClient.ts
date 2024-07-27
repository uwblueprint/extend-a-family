import baseAPIClient from "./BaseAPIClient";
import { HelpRequest } from "../types/HelpRequestType";

const createHelpRequest = async (
  message: string,
  learner: string,
  facilitator: string,
  unit: string,
  module: string,
  page: string,
): Promise<HelpRequest | null> => {
  try {
    const { data } = await baseAPIClient.post(`/help-request`, {
      message,
      learner,
      facilitator,
      unit,
      module,
      page,
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default { createHelpRequest };
