import { ObjectId } from "mongoose";
import { AuthDTO, Token } from "../../types/authTypes";
import { Role } from "../../types/userTypes";

interface IAuthService {
  /**
   * Generate a short-lived JWT access token and a long-lived refresh token
   * when supplied user's email and password
   * @param email user's email
   * @param password user's password
   * @returns AuthDTO object containing the access token, refresh token, and user info
   * @throws Error if token generation fails
   */
  generateToken(email: string, password: string): Promise<AuthDTO>;

  /**
   * Revoke all refresh tokens of a user
   * @param userId userId of user whose refresh tokens are to be revoked
   * @throws Error if token revocation fails
   */
  revokeTokens(userId: string): Promise<void>;

  /**
   * Generate new access and refresh token pair using the provided refresh token
   * @param refreshToken refresh token
   * @returns Token object containing new access and refresh tokens
   * @throws Error if token renewal fails
   */
  renewToken(refreshToken: string): Promise<Token>;

  /**
   * Generate a password reset link for the user with the given email and send
   * the link to that email address
   * @param email email of user requesting password reset
   * @throws Error if unable to generate link or send email
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Generate an email verification link for the user with the given email and send
   * the link to that email address
   * @param email email of user that needs to be verified
   * @throws Error if unable to generate link or send email
   */
  sendEmailVerificationLink(email: string): Promise<void>;

  /**
   * Sends an email invitation to an invited administrator with the temporary password specified
   * @param email email address of new administrator invited
   * @param temporaryPassword the new administrator's temporary password
   * @throws Error if unable to generate link or send email
   */
  sendAdminInvite(email: string, temporaryPassword: string): Promise<void>;

  /**
   * Sends an email invitation to an invited learner with the temporary password specified
   * @param email email of new learner invited
   * @param temporaryPassword the new learner's temporary password
   * @throws Error if unable to generate link or send email
   */
  sendLearnerInvite(
    firstName: string,
    email: string,
    temporaryPassword: string,
  ): Promise<void>;

  /**
   * Changes a user's password
   * @param email the user's email address
   * @param newPassword new password chosen to replace the user's old password
   */
  changeUserPassword(accessToken: string, newPassword: string): Promise<string>;

  /**
   * Determine if the provided access token is valid and authorized for at least
   * one of the specified roles
   * @param accessToken user's access token
   * @param roles roles to check for
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByRole(accessToken: string, roles: Set<Role>): Promise<boolean>;

  /**
   * Determine if the provided access token is valid and issued to the requested user
   * @param accessToken user's access token
   * @param requestedUserId userId of requested user
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByUserId(
    accessToken: string,
    requestedUserId: string,
  ): Promise<boolean>;

  /**
   * Determine if the provided access token is valid and issued to the requested user
   * with the specified email address
   * @param accessToken user's access token
   * @param requestedEmail email address of requested user
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByEmail(
    accessToken: string,
    requestedEmail: string,
  ): Promise<boolean>;

  /**
   * Returns the userid from the provided access token
   * @param accessToken user's access token
   * @returns the userid from the access token
   */
  getUserIdFromAccessToken(accessToken: string): Promise<ObjectId>;
}

export default IAuthService;
