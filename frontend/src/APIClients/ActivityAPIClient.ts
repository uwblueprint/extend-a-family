import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Activity } from "../types/CourseTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const updateActivity = async <ActivityType extends Activity>(
  activity: ActivityType,
): Promise<ActivityType | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.patch(
      `/activities/${activity.id}/${activity.type}`,
      activity,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default { updateActivity };
