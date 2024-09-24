import { Request, Response, NextFunction } from "express";
import { validatePrimitive, getApiValidationError } from "./util";

export const getNotificationtDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.skip !== undefined &&
    !validatePrimitive(req.body.skip, "integer")
  ) {
    return res.status(400).send(getApiValidationError("skip", "integer"));
  }
  if (
    req.body.limit !== undefined &&
    !validatePrimitive(req.body.limit, "integer")
  ) {
    return res.status(400).send(getApiValidationError("limit", "integer"));
  }
  return next();
};
