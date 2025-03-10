import * as firebaseAdmin from "firebase-admin";
import { ObjectId } from "mongoose";

import IAuthService from "../interfaces/authService";
import IEmailService from "../interfaces/emailService";
import IUserService from "../interfaces/userService";
import { AuthDTO, Token } from "../../types/authTypes";
import { Role } from "../../types/userTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import FirebaseRestClient from "../../utilities/firebaseRestClient";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class AuthService implements IAuthService {
  userService: IUserService;

  emailService: IEmailService | null;

  constructor(
    userService: IUserService,
    emailService: IEmailService | null = null,
  ) {
    this.userService = userService;
    this.emailService = emailService;
  }

  /* eslint-disable class-methods-use-this */
  async generateToken(email: string, password: string): Promise<AuthDTO> {
    try {
      const user = await this.userService.getUserByEmail(email);
      const token = await FirebaseRestClient.signInWithPassword(
        email,
        password,
      );
      return { ...token, ...user };
    } catch (error) {
      Logger.error(`Failed to generate token for user with email ${email}`);
      throw error;
    }
  }

  async revokeTokens(userId: string): Promise<void> {
    try {
      const authId = await this.userService.getAuthIdById(userId);

      await firebaseAdmin.auth().revokeRefreshTokens(authId);
    } catch (error: unknown) {
      const errorMessage = [
        "Failed to revoke refresh tokens of user with id",
        `${userId}.`,
        "Reason =",
        getErrorMessage(error),
      ];
      Logger.error(errorMessage.join(" "));

      throw error;
    }
  }

  async renewToken(refreshToken: string): Promise<Token> {
    try {
      return await FirebaseRestClient.refreshToken(refreshToken);
    } catch (error) {
      Logger.error("Failed to refresh token");
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call resetPassword but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const resetLink = await firebaseAdmin
        .auth()
        .generatePasswordResetLink(email);
      const emailBody = `
      Hello,
      <br><br>
      We have received a password reset request for your account.
      Please click the following link to reset it.
      <strong>This link is only valid for 1 hour.</strong>
      <br><br>
      <a href=${resetLink}>Reset Password</a>`;

      this.emailService.sendEmail(email, "Your Password Reset Link", emailBody);
    } catch (error) {
      Logger.error(
        `Failed to generate password reset link for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendEmailVerificationLink(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailVerificationLink but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const emailVerificationLink = await firebaseAdmin
        .auth()
        .generateEmailVerificationLink(email);
      const emailBody = `
      Hello,
      <br><br>
      Please click the following link to verify your email and activate your account.
      <strong>This link is only valid for 1 hour.</strong>
      <br><br>
      <a href=${emailVerificationLink}>Verify email</a>`;

      this.emailService.sendEmail(email, "Verify your email", emailBody);
    } catch (error) {
      Logger.error(
        `Failed to generate email verification link for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendAdminInvite(
    email: string,
    temporaryPassword: string,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendAdminInvite but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const emailVerificationLink = await firebaseAdmin
        .auth()
        .generateEmailVerificationLink(email);

      const emailBody = `Hello,<br> <br>
        You have been invited as an administrator to Smart Saving, Smart Spending.
        <br> <br>
        Please click the following link to verify your email and activate your account.
        <strong>This link is only valid for 1 hour.</strong>
        <br> <br>
        <a href=${emailVerificationLink}>Verify email</a>
        <br> <br>
        To log in for the first time, use your email address and the following temporary password: <strong>${temporaryPassword}</strong>`;

      await this.emailService.sendEmail(
        email,
        "Administrator Invitation: Smart Saving, Smart Spending",
        emailBody,
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to invite new administrator. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async changeUserPassword(
    accessToken: string,
    newPassword: string,
  ): Promise<string> {
    try {
      return await FirebaseRestClient.changePassword(accessToken, newPassword);
    } catch (error: unknown) {
      Logger.error(
        `Failed to change user's password. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendLearnerInvite(
    firstName: string,
    email: string,
    temporaryPassword: string,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendLearnerInvite but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const emailVerificationLink = await firebaseAdmin
      .auth()
      .generateEmailVerificationLink(email);

    const emailBody = `Hello ${firstName},
      <br><br>
      Welcome to Smart Saving, Smart Spending!
      <br><br>
      Please click the link to confirm your account: <a href=${emailVerificationLink}>Confirm my account</a>
      <br>
      If the link has expired, ask your facilitator to invite you again.
      <br><br>
      To log in for the first time, use the following email and password:
      <br><br>
      Email: <strong>${email}</strong>
      <br>
      Password: <strong>${temporaryPassword}</strong>
      <br><br>
      Happy learning!`;

    await this.emailService.sendEmail(
      email,
      "Welcome to Smart Saving, Smart Spending!",
      emailBody,
    );
  }

  async isAuthorizedByRole(
    accessToken: string,
    roles: Set<Role>,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      const userRole = await this.userService.getUserRoleByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return firebaseUser.emailVerified && roles.has(userRole);
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByUserId(
    accessToken: string,
    requestedUserId: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      const tokenUserId = await this.userService.getUserIdByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return (
        firebaseUser.emailVerified && String(tokenUserId) === requestedUserId
      );
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByEmail(
    accessToken: string,
    requestedEmail: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return (
        firebaseUser.emailVerified && decodedIdToken.email === requestedEmail
      );
    } catch (error) {
      return false;
    }
  }

  async getUserIdFromAccessToken(accessToken: string): Promise<ObjectId> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      const userId = await this.userService.getUserIdByAuthId(
        decodedIdToken.uid,
      );
      return userId;
    } catch (error) {
      Logger.error(`Failed to retrieve a userId from this accessToken`);
      throw error;
    }
  }
}

export default AuthService;
