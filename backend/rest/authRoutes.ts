import { CookieOptions, Router } from "express";

import { generate } from "generate-password";
import {
  getAccessToken,
  isAuthorizedByEmail,
  isAuthorizedByUserId,
  isAuthorizedByRole,
} from "../middlewares/auth";
import {
  loginRequestValidator,
  signupRequestValidator,
  inviteAdminRequestValidator,
  forgotPasswordRequestValidator,
} from "../middlewares/validators/authValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import { getErrorMessage } from "../utilities/errorUtils";

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

    const { accessToken, refreshToken, ...rest } = authDTO;

    correctRole = await authService.correctRole(accessToken);

    if (correctRole !== requestedRole) {
      throw new Error("WRONG_USER_TYPE");
    }

    const isVerified = await authService.isAuthorizedByEmail(
      accessToken,
      req.body.email,
    );

    if (!isVerified) {
      throw new Error("UNVERIFIED_EMAIL");
    }

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (
      req.body.attemptedRole !== "Learner" &&
      (message === "EMAIL_NOT_FOUND" || message === "INCORRECT_PASSWORD")
    ) {
      res.status(500).json({ error: "INVALID_LOGIN_CREDENTIALS" });
    } else if (message === "WRONG_USER_TYPE") {
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
authRouter.post(
  "/resetPassword/:email",
  isAuthorizedByEmail("email"),
  async (req, res) => {
    try {
      await authService.resetPassword(req.params.email);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

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
  inviteAdminRequestValidator,
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

export default authRouter;
