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

const getHelpRequests = async (userId: string): Promise<HelpRequest[]> => {
  try {
    const { data } = await baseAPIClient.get(`/help-request?userId=${userId}`);
    return data;
  } catch (error) {
    return [];
  }
};

const getHelpRequest = async (
  requestId: string,
): Promise<HelpRequest | null> => {
  try {
    const { data } = await baseAPIClient.get(`/help-request/${requestId}`);
    return data;
  } catch (error) {
    return null;
  }
};

const markHelpRequestCompleted = async (
  requestId: string,
  completed: boolean,
): Promise<HelpRequest | null> => {
  try {
    const { data } = await baseAPIClient.put(`/help-request/${requestId}`, {
      completed,
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  createHelpRequest,
  getHelpRequests,
  getHelpRequest,
  markHelpRequestCompleted,
};
