import { NextFunction, Request, Response } from "express";
import CourseUnitService from "../../services/implementations/courseUnitService";
import { getErrorMessage } from "../../utilities/errorUtils";
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
  try {
    const { unitId, moduleId } = req.params;
    console.log("unit module validator", req.params);

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
  } catch (e: unknown) {
    return res
      .status(404)
      .send(
        `Unable to verify that module belongs to unit: ${getErrorMessage(e)}`,
      );
  }
};
