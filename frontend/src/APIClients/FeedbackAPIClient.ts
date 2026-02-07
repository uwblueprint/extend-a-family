import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { FeedbackPopulated } from "../types/FeedbackTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const fetchAllFeedback = async (): Promise<Array<FeedbackPopulated>> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  const { data } = await baseAPIClient.get(`/feedbacks/`, {
    headers: { Authorization: bearerToken },
  });
  return data;
};

const hasFeedback = async (
  learnerId: string,
  moduleId: string,
): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  const { data } = await baseAPIClient.get(
    `/feedbacks/check?moduleId=${moduleId}&learnerId=${learnerId}`,
    {
      headers: { Authorization: bearerToken },
    },
  );
  return data.hasFeedback;
};

export default { fetchAllFeedback, hasFeedback };
