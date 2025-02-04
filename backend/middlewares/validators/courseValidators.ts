import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";
import CourseUnitService from "../../services/implementations/courseUnitService";
import CourseModuleService from "../../services/implementations/courseModuleService";

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

export const coursePageDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.type, "string")) {
    return res.status(400).send(getApiValidationError("type", "string"));
  }
  if (req.body.type === "Lesson") {
    if (!validatePrimitive(req.body.source, "string")) {
      return res.status(400).send(getApiValidationError("source", "string"));
    }
  } else if (req.body.type === "Activity") {
    if (!req.body.elements) {
      return res.status(400).send("Elements field missing for Activity Page");
    }
  } else {
    return res.status(400).send(`Invalid page type "${req.body.type}"`);
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

export const pageBelongsToModuleValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { moduleId, pageId } = req.params;

  const courseModuleService: CourseModuleService = new CourseModuleService();

  const courseModule = await courseModuleService.getCourseModule(moduleId);

  if (!courseModule.pages.includes(pageId)) {
    return res
      .status(404)
      .send(
        `Page with ID ${pageId} is not found in module with ID ${moduleId}`,
      );
  }

  return next();
};
