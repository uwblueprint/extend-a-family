import { NextFunction, Request, Response } from "express";
import CourseModuleService from "../../services/implementations/courseModuleService";
import CourseUnitService from "../../services/implementations/courseUnitService";
import { getErrorMessage } from "../../utilities/errorUtils";
import {
  getApiValidationError,
  getFileTypeValidationError,
  validateFileType,
  validatePrimitive,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const moduleThumbnailValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.params.moduleId, "string")) {
    return res.status(400).send(getApiValidationError("moduleId", "string"));
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
  if (!validatePrimitive(req.body.title, "string")) {
    return res.status(400).send(getApiValidationError("title", "string"));
  }
  if (!validatePrimitive(req.body.type, "string")) {
    return res.status(400).send(getApiValidationError("type", "string"));
  }
  if (req.body.type === "Lesson") {
    if (!validatePrimitive(req.body.source, "string")) {
      return res.status(400).send(getApiValidationError("source", "string"));
    }
  } else if (req.body.type === "Activity") {
    if (!req.body.layout) {
      return res.status(400).send("Layout field missing for Activity Page");
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
  try {
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
  } catch (e: unknown) {
    return res
      .status(404)
      .send(
        `Unable to verify that module belongs to unit: ${getErrorMessage(e)}`,
      );
  }
};

export const pageBelongsToModuleValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { moduleId, pageId } = req.params;

  const courseModuleService: CourseModuleService = new CourseModuleService();

  const courseModule = await courseModuleService.getCourseModule(moduleId);

  if (courseModule?.pages.filter((page) => page.id === pageId).length === 0) {
    return res
      .status(404)
      .send(
        `Page with ID ${pageId} is not found in module with ID ${moduleId}`,
      );
  }

  return next();
};
