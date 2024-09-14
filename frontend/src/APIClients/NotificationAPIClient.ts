import baseAPIClient from "./BaseAPIClient";
import { NotificationsResponse } from "../types/NotificationTypes";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const getNotifications = async (
  skip: number,
  limit: number,
): Promise<NotificationsResponse | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/notifications`,
      {
        skip,
        limit,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default { getNotifications };
