import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Activity, CourseModule, QuestionType } from "../types/CourseTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const createActivity = async (
  moduleId: string,
  questionType: QuestionType,
  index?: number,
): Promise<CourseModule | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/activities/${moduleId}/${questionType}`,
      { index },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

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
    // eslint-disable-next-line no-alert
    alert(
      "Failed to update activity. Please refresh the page, try again later, or contact us.",
    );
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

const sendFeedback = async (feedback: {
  learnerId: string;
  moduleId: string;
  isLiked?: boolean;
  difficulty?: number;
  message?: string;
}) => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(`/feedbacks/`, feedback, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

const uploadImage = async (
  path: string,
  file: File,
): Promise<string | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const formData = new FormData();
    formData.append("uploadedImage", file);
    formData.append("path", path);
    const { data } = await baseAPIClient.patch(
      `/activities/UploadImage`,
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

export default {
  createActivity,
  updateActivity,
  updateActivityMainPicture,
  sendFeedback,
  uploadImage,
};
