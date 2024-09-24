import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createCourseUnitDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.title, "string")) {
    return res.status(400).send(getApiValidationError("title", "string"));
  }
  return next();
};

export const updateCourseUnitDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.title, "string")) {
    return res.status(400).send(getApiValidationError("title", "string"));
  }
  return next();
};
