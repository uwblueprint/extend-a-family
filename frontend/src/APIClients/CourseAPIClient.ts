import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { CourseModule, CourseUnit } from "../types/CourseTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getUnits = async (): Promise<CourseUnit[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/course/", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const createUnit = async (title: string): Promise<CourseUnit | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/course/",
      { title },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const editUnit = async (
  unitId: string,
  title: string,
): Promise<CourseUnit | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.put(
      `/course/${unitId}`,
      { title },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const deleteUnit = async (unitId: string): Promise<string | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.delete(`/course/${unitId}`, {
      headers: { Authorization: bearerToken },
    });
    return data.id;
  } catch (error) {
    return null;
  }
};

const getModules = async (unitId: string): Promise<CourseModule[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/course/${unitId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const createModule = async (unitId: string, title: string) => {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/course/${unitId}`,
      { title },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const uploadThumbnail = async (moduleID: string, uploadedImage: FormData) => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/course/${moduleID}/uploadThumbnail`,
      uploadedImage,
      {
        headers: {
          Authorization: bearerToken,
          contentType: "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error: unknown) {
    return null;
  }
};

const lessonUpload = async (
  lesson: File,
  moduleId: string,
): Promise<string> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const formData = new FormData();
    formData.append("lessonPdf", lesson);
    formData.append("moduleId", moduleId);
    const { data } = await baseAPIClient.post(
      "/course/uploadLessons",
      formData,
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return "";
  }
};

const getModuleById = async (
  moduleId: string,
): Promise<(CourseModule & { lessonPdfUrl: string }) | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/course/module/${moduleId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  getUnits,
  createUnit,
  editUnit,
  deleteUnit,
  getModules,
  createModule,
  uploadThumbnail,
  lessonUpload,
  getModuleById,
};
