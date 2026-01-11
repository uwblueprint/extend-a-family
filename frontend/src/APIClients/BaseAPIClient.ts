import axios, { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";

import { DecodedJWT } from "../types/AuthTypes";

const baseAPIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Python API uses snake_case, frontend uses camelCase
// convert request and response data to/from snake_case and camelCase through axios interceptors

baseAPIClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // if access token in header has expired, do a refresh
  const authHeaderParts =
    typeof config.headers?.Authorization === "string" &&
    config.headers?.Authorization.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    const decodedToken = jwtDecode(authHeaderParts[1]) as DecodedJWT;

    if (
      decodedToken &&
      (typeof decodedToken === "string" ||
        decodedToken.exp <= Math.round(new Date().getTime() / 1000))
    ) {
      const refreshToken = getLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "refreshToken",
      );

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth/refresh`,
        { refreshToken },
      );

      const accessToken = data.accessToken || data.access_token;
      setLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
        accessToken,
      );

      // Update refreshToken in localStorage
      if (data.refreshToken) {
        setLocalStorageObjProperty(
          AUTHENTICATED_USER_KEY,
          "refreshToken",
          data.refreshToken,
        );
      }

      if (newConfig.headers) {
        newConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  }

  return newConfig;
});

export default baseAPIClient;
