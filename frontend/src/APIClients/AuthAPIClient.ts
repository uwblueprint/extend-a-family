import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser, Role } from "../types/AuthTypes";
import baseAPIClient from "./BaseAPIClient";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";

const login = async (
  email: string,
  password: string,
  attemptedRole: Role,
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { email, password, attemptedRole },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    return null;
  }
};

const logout = async (userId: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string, // Added role parameter
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/signup",
      { firstName, lastName, email, password, role }, // Added role to request body
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const resetPassword = async (email: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const updateTemporaryPassword = async (newPassword: string): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/auth/updateTemporaryPassword`,
      { newPassword },
      { headers: { Authorization: bearerToken } },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

const isUserVerified = async (
  email: string,
  accessToken: string,
): Promise<boolean> => {
  const bearerToken = `Bearer ${accessToken}`;

  try {
    const { data } = await baseAPIClient.post(
      `/auth/isUserVerified/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return data.isVerified;
  } catch (error) {
    return false;
  }
};

export default {
  login,
  logout,
  signup,
  resetPassword,
  updateTemporaryPassword,
  refresh,
  isUserVerified,
};
