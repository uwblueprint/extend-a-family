import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Role } from "../types/AuthTypes";
import { User } from "../types/UserTypes";
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

export default {
  getUsersByRole,
  getUsers,
  updateUserDetails,
};
