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

export default { fetchAllFeedback };
