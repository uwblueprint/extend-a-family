import { NextFunction, Request, Response } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

export const createFeedbackDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.learnerId, "string")) {
    return res.status(400).send(getApiValidationError("learnerId", "string"));
  }
  if (!validatePrimitive(req.body.moduleId, "string")) {
    return res.status(400).send(getApiValidationError("moduleId", "string"));
  }
  if (!validatePrimitive(req.body.isLiked, "boolean")) {
    return res.status(400).send(getApiValidationError("isLiked", "boolean"));
  }
  if (!validatePrimitive(req.body.difficulty, "integer")) {
    return res.status(400).send(getApiValidationError("difficulty", "integer"));
  }
  if (!validatePrimitive(req.body.message, "string")) {
    return res.status(400).send(getApiValidationError("message", "string"));
  }

  return next();
};
