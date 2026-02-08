import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

export interface ModuleCompletion {
  moduleId: string;
  completedAt: string;
}

export interface CourseProgress {
  totalActivities: number;
  completedActivities: number;
  progressPercentage: number;
  totalModules: number;
  completedModules: number;
}

export interface LearnerProgress {
  id: string;
  learnerId: string;
  completedActivities: string[];
  moduleCompletions: ModuleCompletion[];
  lastViewedPage?: {
    moduleId: string;
    pageId: string;
    viewedAt: string;
  };
}

export interface ModuleProgress {
  totalActivities: number;
  completedActivities: number;
  isModuleCompleted: boolean;
  completedAt?: string;
}

const completeActivity = async (
  activityId: string,
  moduleId: string,
): Promise<{ success: boolean; moduleCompleted?: boolean } | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/progress/activity/complete",
      { activityId, moduleId },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to complete activity:", error);
    return null;
  }
};

const getModuleProgress = async (
  moduleId: string,
): Promise<ModuleProgress | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/progress/module/${moduleId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to get module progress:", error);
    return null;
  }
};

const getCourseProgress = async (): Promise<CourseProgress | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/progress/course", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to get course progress:", error);
    return null;
  }
};

const updateLastViewedPage = async (
  moduleId: string,
  pageId: string,
): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      "/progress/page/view",
      { moduleId, pageId },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to update last viewed page:", error);
    return false;
  }
};

const getLearnerProgress = async (): Promise<LearnerProgress | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/progress", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to get learner progress:", error);
    return null;
  }
};

export default {
  completeActivity,
  getModuleProgress,
  getCourseProgress,
  updateLastViewedPage,
  getLearnerProgress,
};
