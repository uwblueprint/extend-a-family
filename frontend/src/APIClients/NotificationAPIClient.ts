import baseAPIClient from "./BaseAPIClient";
import { NotificationsResponse } from "../types/NotificationTypes";

const getNotifications = async (
  userId: string,
  start: number | null,
  limit: number | null,
): Promise<NotificationsResponse | null> => {
  try {
    console.log(userId, start, limit)
    const queryParams = new URLSearchParams();
    queryParams.append("user", userId);
    if (start !== null) queryParams.append("start", start.toString());
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
