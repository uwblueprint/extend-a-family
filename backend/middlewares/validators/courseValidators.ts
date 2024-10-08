import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";
import CourseUnitService from "../../services/implementations/courseUnitService";

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

export const createCourseModuleDtoValidator = async (
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

export const moduleBelongsToUnitValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { unitId, moduleId } = req.params;

  const courseUnitService: CourseUnitService = new CourseUnitService();

  const courseUnit = await courseUnitService.getCourseUnit(unitId);

  if (!courseUnit.modules.includes(moduleId)) {
    return res
      .status(404)
      .send(
        `Module with ID ${moduleId} is not found in unit with ID ${unitId}`,
      );
  }
  return next();
};
