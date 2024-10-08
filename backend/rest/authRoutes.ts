import { CookieOptions, Router } from "express";

import { generate } from "generate-password";
import {
  getAccessToken,
  isAuthorizedByUserId,
  isAuthorizedByRole,
  isFirstTimeInvitedUser,
} from "../middlewares/auth";
import {
  loginRequestValidator,
  signupRequestValidator,
  inviteUserRequestValidator,
  forgotPasswordRequestValidator,
  updateTemporaryPasswordRequestValidator,
  updateUserStatusRequestValidator,
} from "../middlewares/validators/authValidators";
import * as firebaseAdmin from "firebase-admin"
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import { getErrorMessage } from "../utilities/errorUtils";
import { AuthErrorCodes } from "../types/authTypes";

const authRouter: Router = Router();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.PREVIEW_DEPLOY ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

/* Returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/login", loginRequestValidator, async (req, res) => {
  const requestedRole = req.body.attemptedRole;
  let correctRole = null;
  try {
    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );

    const { refreshToken, ...rest } = authDTO;
    correctRole = rest.role;

    if (correctRole !== requestedRole) {
      throw new Error(AuthErrorCodes.WRONG_USER_TYPE);
    }

    const isVerified = await authService.isAuthorizedByEmail(
      rest.accessToken,
      req.body.email,
    );

    if (!isVerified) {
      throw new Error(AuthErrorCodes.UNVERIFIED_EMAIL);
    }

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (
      req.body.attemptedRole !== "Learner" &&
      (message === AuthErrorCodes.EMAIL_NOT_FOUND ||
        message === AuthErrorCodes.INCORRECT_PASSWORD)
    ) {
      res.status(500).json({ error: AuthErrorCodes.INVALID_LOGIN_CREDENTIALS });
    } else if (message === AuthErrorCodes.WRONG_USER_TYPE) {
      res.status(500).json({
        error: message,
        errorData: [requestedRole, correctRole],
      });
    } else {
      res.status(500).json({ error: message });
    }
  }
});

/* Signup a user, returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/signup", signupRequestValidator, async (req, res) => {
  try {
    await userService.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      status: "Active",
    });

    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );
    const { refreshToken, ...rest } = authDTO;

    await authService.sendEmailVerificationLink(req.body.email);

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Returns access token in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/refresh", async (req, res) => {
  try {
    const token = await authService.renewToken(req.cookies.refreshToken);

    res
      .cookie("refreshToken", token.refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken: token.accessToken });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Revokes all of the specified user's refresh tokens */
authRouter.post(
  "/logout/:userId",
  isAuthorizedByUserId("userId"),
  async (req, res) => {
    try {
      await authService.revokeTokens(req.params.userId);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Emails a password reset link to the user with the specified email */
authRouter.post("/resetPassword/:email", async (req, res) => {
  try {
    await authService.resetPassword(req.params.email);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

authRouter.post("/isUserVerified/:email", async (req, res) => {
  try {
    const token = getAccessToken(req);
    if (!token) {
      res
        .status(401)
        .json({ error: "You are not authorized to make this request." });
    } else {
      const isVerified = await authService.isAuthorizedByEmail(
        token,
        req.params.email,
      );
      res.status(200).json({ isVerified });
    }
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

authRouter.post(
  "/inviteAdmin",
  inviteUserRequestValidator,
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    try {
      const temporaryPassword = generate({
        length: 20,
        numbers: true,
      });
      const invitedAdminUser = await userService.createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: "Administrator",
        password: temporaryPassword,
        status: "Invited",
      });
      await authService.sendAdminInvite(req.body.email, temporaryPassword);
      res.status(200).json(invitedAdminUser);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

authRouter.post(
  "/inviteLearner",
  inviteUserRequestValidator,
  isAuthorizedByRole(new Set(["Facilitator"])),
  async (req, res) => {
    try {
      const accessToken = getAccessToken(req)!;
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      //const { id } = await userService.getUserById(decodedIdToken.uid);
      const temporaryPassword = generate({
        length: 20,
        numbers: true,
      });
      const invitedLearnerUser = await userService.createLearner({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: "Learner",
        password: temporaryPassword,
        status: "Invited",
      }, ""); // TODO: pass in facilitator Object ID in here
      await authService.sendLearnerInvite(
        req.body.firstName,
        req.body.email,
        temporaryPassword
      );
      res.status(200).json(invitedLearnerUser);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
);

// /* Reset password through a "Forgot Password" option */
authRouter.post(
  "/forgotPassword",
  forgotPasswordRequestValidator,
  async (req, res) => {
    try {
      await userService.getUserByEmail(req.body.email);
      await authService.resetPassword(req.body.email);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

authRouter.post(
  "/updateTemporaryPassword",
  updateTemporaryPasswordRequestValidator,
  isFirstTimeInvitedUser(),
  async (req, res) => {
    try {
      const accessToken = getAccessToken(req)!;
      const newAccessToken = await authService.changeUserPassword(
        accessToken,
        req.body.newPassword,
      );
      res.status(200).json({
        accessToken: newAccessToken,
      });
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

authRouter.post(
  "/updateUserStatus",
  updateUserStatusRequestValidator,
  async (req, res) => {
    try {
      const accessToken = getAccessToken(req)!;
      await userService.changeUserStatus(accessToken, req.body.status);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default authRouter;
