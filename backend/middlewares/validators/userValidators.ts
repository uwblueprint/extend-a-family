import { NextFunction, Request, Response } from "express";
import {
  getApiValidationError,
  getFileTypeValidationError,
  validateFileType,
  validatePrimitive,
} from "./util";
import { isRole } from "../../types/userTypes";
import { getAccessToken } from "../auth";
import IAuthService from "../../services/interfaces/authService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import nodemailerConfig from "../../nodemailer.config";


const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);


export const uploadProfilePictureValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.params.userId, "string")) {
    return res.status(400).send(getApiValidationError("userId", "string"));
  }

  if (!req.file) {
    return res.status(400).send("File has not been uploaded");
  }

  if (!req.file.buffer) {
    return res.status(400).send("File missing buffer field");
  }

  if (!req.file.mimetype) {
    return res.status(400).send("File is missing mimetype field");
  }

  if (!validateFileType(req.file.mimetype)) {
    return res
      .status(400)
      .send(getFileTypeValidationError(req.body.file.mimetype));
  }

  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.email, "string")) {
    return res.status(400).send(getApiValidationError("email", "string"));
  }
  if (!validatePrimitive(req.body.role, "string") && isRole(req.body.role)) {
    return res.status(400).send(getApiValidationError("role", "string"));
  }
  if (!validatePrimitive(req.body.password, "string")) {
    return res.status(400).send(getApiValidationError("password", "string"));
  }

  return next();
};

export const updateUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.role, "string") && isRole(req.body.role)) {
    return res.status(400).send(getApiValidationError("role", "string"));
  }
  return next();
};

export const updateUserAccountValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = getAccessToken(req)
  const userId = await authService.getUserIdFromAccessToken(accessToken || "")
  const authId = await userService.getAuthIdById(userId.toString())
  const role: string = await userService.getUserRoleByAuthId(authId)
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (req.body.bio) {
    if (role != "Facilitator") {
      // remove bio field from non-facilitator
      req.body.bio = undefined;
    } else if (!validatePrimitive(req.body.bio, "string")) {
      // validate string type for facilitator
      return res.status(400).send(getApiValidationError("bio", "string"));
    }
  }
  if (req.body.emailPrefrence) {
    if (role != "Facilitator") {
      // remove bio field from non-facilitator
      req.body.emailPrefrence = undefined;
    } else if (!validatePrimitive(req.body.emailPrefrence, "integer")) {
      // validate string type for facilitator
      return res.status(400).send(getApiValidationError("bio", "string"));
    }
  }
  return next();
};

export const addBookmarkValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.unitId, "string")) {
    return res.status(400).send(getApiValidationError("unitId", "string"));
  }
  if (!validatePrimitive(req.body.moduleId, "string")) {
    return res.status(400).send(getApiValidationError("moduleId", "string"));
  }
  if (!validatePrimitive(req.body.pageId, "string")) {
    return res.status(400).send(getApiValidationError("pageId", "string"));
  }
  return next();
};

export const deleteBookmarkValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.pageId, "string")) {
    return res.status(400).send(getApiValidationError("pageId", "string"));
  }
  return next();
};
