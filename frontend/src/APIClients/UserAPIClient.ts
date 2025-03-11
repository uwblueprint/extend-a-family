import axios from "axios";
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

const updateUserDetails = async (
  userId: string,
  firstName: string,
  lastName: string,
  role: Role,
): Promise<User> => {
  try {
    const accessToken = getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    );

    if (!accessToken) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const updatePayload = {
      firstName,
      lastName,
      role,
      status: "Active",
    };

    const bearerToken = `Bearer ${accessToken}`;

    const { data } = await baseAPIClient.put(
      `/users/${userId}`,
      updatePayload,
      {
        headers: { Authorization: bearerToken },
      },
    );

    return data;
  } catch (error) {
    // Using a conditional to satisfy no-console rule
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Error updating user details:", error);
    }

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(`Request failed with status ${error.response.status}`);
      }
    }

    throw error;
  }
};

export default {
  getUsersByRole,
  getUsers,
  updateUserDetails,
};
