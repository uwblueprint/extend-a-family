import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.idToken) {
    if (!validatePrimitive(req.body.idToken, "string")) {
      return res.status(400).json(getApiValidationError("idToken", "string"));
    }
  } else {
    if (!validatePrimitive(req.body.email, "string")) {
      return res.status(400).send(getApiValidationError("email", "string"));
    }
    if (!validatePrimitive(req.body.password, "string")) {
      return res.status(400).send(getApiValidationError("password", "string"));
    }
  }
  return next();
};

export const signupRequestValidator = async (
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
  if (!validatePrimitive(req.body.password, "string")) {
    return res.status(400).send(getApiValidationError("password", "string"));
  }

  return next();
};

export const inviteAdminRequestValidator = async (
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

  return next();
};

export const forgotPasswordRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.email, "string")) {
    return res.status(400).send(getApiValidationError("email", "string"));
  }

  return next();
}

export const updateTemporaryPasswordRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.newPassword, "string")) {
    return res.status(400).send(getApiValidationError("newPassword", "string"));
  }

  return next();
};

export const updateUserStatusRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.status, "string")) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }

  return next();
}
