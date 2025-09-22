import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser, AuthError, Role, Status } from "../types/AuthTypes";
import { Administrator } from "../types/UserTypes";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

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
      throw new Error(error.response?.data.error, {
        cause: error.response?.data as AuthError,
      });
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
  role: string,
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/signup",
      { firstName, lastName, email, password, role },
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

const resetPassword = async (email: string): Promise<boolean> => {
  try {
    await baseAPIClient.post(`/auth/resetPassword/${email}`, {});
    return true;
  } catch (error) {
    return false;
  }
};

const updateTemporaryPassword = async (
  email: string,
  newPassword: string,
  role: Role,
): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/updateTemporaryPassword`,
      { newPassword },
      { headers: { Authorization: bearerToken } },
    );
    const newAuthenticatedUser = await login(email, newPassword, role);
    if (!newAuthenticatedUser) {
      throw new Error("Unable to authenticate user after logging in.");
    }
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      newAuthenticatedUser.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

const changePassword = async (
  email: string,
  newPassword: string,
  role: Role,
): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.put(
      `/auth/changePassword`,
      { newPassword },
      { headers: { Authorization: bearerToken } },
    );
    const newAuthenticatedUser = await login(email, newPassword, role);
    if (!newAuthenticatedUser) {
      throw new Error("Unable to authenticate user after logging in.");
    }
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      newAuthenticatedUser.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

const updateUserStatus = async (newStatus: Status): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/updateUserStatus`,
      { status: newStatus },
      { headers: { Authorization: bearerToken } },
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

const inviteAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
): Promise<Administrator | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    const { data } = await baseAPIClient.post(
      `/auth/inviteAdmin`,
      { firstName, lastName, email },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  login,
  logout,
  signup,
  resetPassword,
  updateTemporaryPassword,
  changePassword,
  updateUserStatus,
  refresh,
  isUserVerified,
  inviteAdmin,
};
