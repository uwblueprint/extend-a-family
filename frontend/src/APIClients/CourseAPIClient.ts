import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { CourseUnit } from "../types/CourseTypes";
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

export default { getUnits, uploadThumbnail, lessonUpload };
