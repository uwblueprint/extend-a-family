import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Role } from "../types/AuthTypes";
import { User } from "../types/UserTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
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

export default {
  getUsersByRole,
  getUsers,
};
