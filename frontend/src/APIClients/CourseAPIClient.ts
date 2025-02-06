import axios from "axios";
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
    const { data } = await axios.post(
      `http://localhost:8080/course/${moduleID}/uploadThumbnail`,
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
    console.log(error)
    return null
  }
};

export default { getUnits, uploadThumbnail };
