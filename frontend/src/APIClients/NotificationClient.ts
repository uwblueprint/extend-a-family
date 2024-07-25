import baseAPIClient from "./BaseAPIClient";
import { Notification } from "../types/NotyificationType";

const getNotifications = async (
  userId: string,
  start: number | null,
  limit: number | null,
): Promise<Notification[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("user", userId);
    if (start) queryParams.append("start", start.toString());
    if (limit) queryParams.append("limit", limit.toString());
    const { data } = await baseAPIClient.get(
      `/notifications?${queryParams.toString()}`,
    );
    return data;
  } catch (error) {
    return [];
  }
};

export default { getNotifications };
