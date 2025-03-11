import { Role, UserDTO } from "./userTypes";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type AuthDTO = Token & UserDTO;

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export enum AuthErrorCodes {
  INVALID_LOGIN_CREDENTIALS = "INVALID_LOGIN_CREDENTIALS",
  UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
  WRONG_USER_TYPE = "WRONG_USER_TYPE",
  EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
}

export type AuthError = {
  error: AuthErrorCodes;
  errorData?: [Role, Role];
};
