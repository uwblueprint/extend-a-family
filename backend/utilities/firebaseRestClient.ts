import fetch, { Response } from "node-fetch";

import { AuthErrorCodes, Token } from "../types/authTypes";
import logger from "./logger";

const Logger = logger(__filename);

const FIREBASE_SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";
const FIREBASE_REFRESH_TOKEN_URL =
  "https://securetoken.googleapis.com/v1/token";
const FIREBASE_CHANGE_PASSWORD_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:update";

type PasswordSignInResponse = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
};

type ChangePasswordResponse = {
  localId: string;
  email: string;
  idToken: string;
  emailVerified: boolean;
};

type RefreshTokenResponse = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

type RequestError = {
  error: {
    code: number;
    message: string;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    errors: any;
  };
};

const FirebaseRestClient = {
  // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
  signInWithPassword: async (
    email: string,
    password: string,
  ): Promise<Token> => {
    const response: Response = await fetch(
      `${FIREBASE_SIGN_IN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const responseJson: PasswordSignInResponse | RequestError =
      await response.json();

    if (!response.ok) {
      const firebaseErrorMessage = (responseJson as RequestError).error.message;

      const errorMessage = [
        "Failed to sign-in via Firebase REST API, status code =",
        `${response.status},`,
        "error message =",
        firebaseErrorMessage,
      ];
      Logger.error(errorMessage.join(" "));
      if (firebaseErrorMessage === "INVALID_LOGIN_CREDENTIALS") {
        throw new Error(AuthErrorCodes.INCORRECT_PASSWORD);
      } else {
        throw new Error("Failed to sign-in via Firebase REST API");
      }
    }

    return {
      accessToken: (responseJson as PasswordSignInResponse).idToken,
      refreshToken: (responseJson as PasswordSignInResponse).refreshToken,
    };
  },

  // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
  refreshToken: async (refreshToken: string): Promise<Token> => {
    const response: Response = await fetch(
      `${FIREBASE_REFRESH_TOKEN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      },
    );

    const responseJson: RefreshTokenResponse | RequestError =
      await response.json();

    if (!response.ok) {
      const errorMessage = [
        "Failed to refresh token via Firebase REST API, status code =",
        `${response.status},`,
        "error message =",
        (responseJson as RequestError).error.message,
      ];
      Logger.error(errorMessage.join(" "));

      throw new Error("Failed to refresh token via Firebase REST API");
    }

    return {
      accessToken: (responseJson as RefreshTokenResponse).id_token,
      refreshToken: (responseJson as RefreshTokenResponse).refresh_token,
    };
  },

  changePassword: async (
    accessToken: string,
    newPassword: string,
  ): Promise<string> => {
    const response: Response = await fetch(
      `${FIREBASE_CHANGE_PASSWORD_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: accessToken,
          password: newPassword,
        }),
      },
    );

    const responseJson: ChangePasswordResponse | RequestError =
      await response.json();

    if (!response.ok) {
      const errorMessage = [
        "Failed to change password via Firebase REST API, status code =",
        `${response.status},`,
        "error message =",
        (responseJson as RequestError).error.message,
      ];
      Logger.error(errorMessage.join(" "));

      throw new Error("Failed to change password via Firebase REST API");
    }

    return (responseJson as ChangePasswordResponse).idToken;
  },
};

export default FirebaseRestClient;
