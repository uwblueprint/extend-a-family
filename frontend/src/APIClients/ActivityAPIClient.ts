import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Activity } from "../types/CourseTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const updateActivity = async <ActivityType extends Activity>(
  activity: ActivityType,
  signal?: AbortSignal,
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
        signal,
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const updateActivityMainPicture = async (
  activityId: string,
  activityType: string,
  file: File,
) => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const formData = new FormData();
    formData.append("uploadedImage", file);
    const { data } = await baseAPIClient.patch(
      `/activities/${activityId}/${activityType}/UpdateMainPicture`,
      formData,
      {
        headers: {
          Authorization: bearerToken,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default { updateActivity, updateActivityMainPicture };
