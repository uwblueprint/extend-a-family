import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Role } from "../types/AuthTypes";
import { User, Bookmark } from "../types/UserTypes";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getUsersByRole = async (role: Role): Promise<User[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/users/${role}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getUsers = async (): Promise<User[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/users/`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const updateUserDetails = async (
  firstName: string,
  lastName: string,
  role: Role,
  status: string,
  bio?: string,
): Promise<User> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.put(
      `/users/updateMyAccount`,
      {
        firstName,
        lastName,
        role,
        status,
        bio,
      },
      {
        headers: { Authorization: bearerToken },
      },
    );
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "firstName", firstName);
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "lastName", lastName);
    if (role === "Facilitator" && bio) {
      setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "bio", bio);
    }
    return data;
  } catch (error) {
    throw new Error("Failed to update user details");
  }
};

const deleteUser = async (userId: string): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.delete(`/users/`, {
      headers: { Authorization: bearerToken },
      params: {
        userId,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const uploadProfilePicture = async (
  userId: string,
  file: File,
): Promise<string> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const formData = new FormData();
    formData.append("uploadedImage", file);

    const { data } = await baseAPIClient.post(
      `/users/${userId}/uploadProfilePicture`,
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
    throw new Error("Failed to upload profile picture");
  }
};

const addBookmark = async (
  unitId: string,
  moduleId: string,
  pageId: string,
): Promise<Bookmark[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/users/addBookmark",
      {
        unitId,
        moduleId,
        pageId,
      },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    throw new Error("Failed to add bookmark");
  }
};

const deleteBookmark = async (pageId: string): Promise<Bookmark[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/users/deleteBookmark",
      {
        pageId,
      },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    throw new Error("Failed to delete bookmark");
  }
};

const getCurrentUser = async (): Promise<User & { bookmarks: Bookmark[] }> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/users/myaccount", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to get current user");
  }
};

export default {
  getUsersByRole,
  getUsers,
  updateUserDetails,
  deleteUser,
  addBookmark,
  deleteBookmark,
  getCurrentUser,
  uploadProfilePicture,
};
