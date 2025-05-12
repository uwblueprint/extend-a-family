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
  userId: string,
  firstName: string,
  lastName: string,
  role: string,
  status: string,
): Promise<User> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const response = await baseAPIClient.put(
      `/users/updateMyAccount/${userId}`,
      {
        firstName,
        lastName,
        role,
        status,
      },
      {
        headers: { Authorization: bearerToken },
      },
    );
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "firstName", firstName);
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "lastName", lastName);
    return response.data;
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

export default {
  getUsersByRole,
  getUsers,
  updateUserDetails,
  deleteUser,
};
