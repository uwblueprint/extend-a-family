import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createNotificationsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.user, "string")) {
    return res.status(400).send(getApiValidationError("user", "string"));
  }
  if (!validatePrimitive(req.body.message, "string")) {
    return res.status(400).send(getApiValidationError("message", "integer"));
  }
  if (!validatePrimitive(req.body.link, "string")) {
    return res.status(400).send(getApiValidationError("link", "integer"));
  }
  return next();
};
