import { PresentableError } from "../types/ErrorTypes";

export enum AuthErrorCodes {
  INVALID_LOGIN_CREDENTIALS = "INVALID_LOGIN_CREDENTIALS",
  UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
  WRONG_USER_TYPE = "WRONG_USER_TYPE",
  EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  EMAIL_IN_USE = "EMAIL_IN_USE",
  INVALID_EMAIL = "INVALID_EMAIL",
}

export const authErrors: Record<AuthErrorCodes, PresentableError> = {
  INVALID_LOGIN_CREDENTIALS: {
    title: () => "Invalid login credentials",
    text: () => "Please check your email and password, and try again.",
  },
  UNVERIFIED_EMAIL: {
    title: () => "Unverified email",
    text: () =>
      "Please check your email and click on the link to verify your email.",
  },
  WRONG_USER_TYPE: {
    title: () => "Wrong user type",
    text: (wrongRole, correctRole) =>
      `It looks like you're trying to log in with the wrong account type (${wrongRole}). Please select the correct user type (${correctRole}) and try again.`,
  },
  EMAIL_NOT_FOUND: {
    text: () => "Email not found. Please try again.",
  },
  INCORRECT_PASSWORD: {
    text: () => "Incorrect password. Please try again.",
  },
  EMAIL_IN_USE: {
    title: () => "Email in use",
    text: () => "The email address is already in use by another account.",
  },
  INVALID_EMAIL: {
    title: () => "Invalid email",
    text: () => "Please enter a valid email (e.g. user@example.com).",
  },
};

export const defaultAuthError: PresentableError = {
  title: () => "An error occurred",
  text: () => "Something went wrong. Please try again later.",
};
