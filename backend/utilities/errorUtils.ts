/* eslint-disable-next-line import/prefer-default-export */
export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Unknown error occurred.";
};

/* eslint-disable-next-line import/prefer-default-export */
export const getErrorCode = (error: unknown): string => {
  const firebaseError = error as { code?: string };
  const errorCode = firebaseError.code || "unknown";
  return error instanceof Error ? errorCode : "Unknown error occurred.";
};
