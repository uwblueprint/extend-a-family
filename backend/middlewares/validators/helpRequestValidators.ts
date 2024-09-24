import { Request, Response, NextFunction } from "express";
import { validatePrimitive, getApiValidationError } from "./util";

export const createHelpRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.message, "string")) {
    return res.status(400).send(getApiValidationError("message", "string"));
  }
  if (!validatePrimitive(req.body.learner, "string")) {
    return res.status(400).send(getApiValidationError("learner", "string"));
  }
  if (!validatePrimitive(req.body.facilitator, "string")) {
    return res.status(400).send(getApiValidationError("facilitator", "string"));
  }
  if (!validatePrimitive(req.body.unit, "string")) {
    return res.status(400).send(getApiValidationError("unit", "string"));
  }
  if (!validatePrimitive(req.body.module, "string")) {
    return res.status(400).send(getApiValidationError("module", "string"));
  }
  if (!validatePrimitive(req.body.page, "string")) {
    return res.status(400).send(getApiValidationError("page", "string"));
  }
  return next();
};

export const updateHelpRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.unit !== undefined &&
    !validatePrimitive(req.body.unit, "string")
  ) {
    return res.status(400).send(getApiValidationError("unit", "string"));
  }
  if (
    req.body.module !== undefined &&
    !validatePrimitive(req.body.module, "string")
  ) {
    return res.status(400).send(getApiValidationError("module", "string"));
  }
  if (
    req.body.page !== undefined &&
    !validatePrimitive(req.body.page, "string")
  ) {
    return res.status(400).send(getApiValidationError("page", "string"));
  }
  if (
    req.body.completed !== undefined &&
    !validatePrimitive(req.body.completed, "boolean")
  ) {
    return res.status(400).send(getApiValidationError("completed", "boolean"));
  }
  return next();
};
