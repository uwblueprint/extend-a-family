import baseAPIClient from "./BaseAPIClient";
import { NotificationsResponse } from "../types/NotificationTypes";

const getNotifications = async (
  userId: string,
  skip: number | null,
  limit: number | null,
): Promise<NotificationsResponse | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("user", userId);
    if (skip !== null) queryParams.append("skip", skip.toString());
    if (limit !== null) queryParams.append("limit", limit.toString());
    const { data } = await baseAPIClient.get(
      `/notifications?${queryParams.toString()}`,
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default { getNotifications };
