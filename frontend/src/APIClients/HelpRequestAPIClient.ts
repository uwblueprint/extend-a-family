import baseAPIClient from "./BaseAPIClient";
import { HelpRequest } from "../types/HelpRequestType";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const createHelpRequest = async (
  message: string,
  learner: string,
  facilitator: string,
  unit: string,
  module: string,
  page: string,
): Promise<HelpRequest | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/help-request`,
      {
        message,
        learner,
        facilitator,
        unit,
        module,
        page,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const getHelpRequests = async (userId: string): Promise<HelpRequest[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/help-request?userId=${userId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getHelpRequest = async (
  requestId: string,
): Promise<HelpRequest | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/help-request/${requestId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

const markHelpRequestCompleted = async (
  requestId: string,
  completed: boolean,
): Promise<HelpRequest | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.put(`/help-request/${requestId}`, {
      completed,
      headers: { Authorization: bearerToken },
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
