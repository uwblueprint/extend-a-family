import { NextFunction, Request, Response } from "express";
import CourseModuleModel from "../../models/coursemodule.mgmodel";
import { ModuleStatus } from "../../types/courseTypes";
import { getFileTypeValidationError, validateFileType } from "./util";

/**
 * Ensure module status is Draft or Unpublished
 */
export const checkModuleEditable = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const moduleDoc = await CourseModuleModel.findById(
      req.params.moduleId,
    ).lean();
    if (!moduleDoc) {
      res.status(404).send("Module not found");
      return;
    }
    if (
      ![ModuleStatus.Draft, ModuleStatus.Unpublished].includes(
        moduleDoc.status as ModuleStatus,
      )
    ) {
      res.status(403).send("Module not editable in its current state");
      return;
    }
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(500).send(message);
  }
};

/**
 * Ensure the module that contains the provided activityId is Draft or Unpublished
 */
export const checkActivityEditable = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { activityId } = req.params;
    if (!activityId) {
      res.status(400).send("Missing activityId");
      return;
    }
    // find module that contains this activity id in its pages array
    const moduleDoc = await CourseModuleModel.findOne({
      pages: activityId,
    }).lean();
    if (!moduleDoc) {
      res.status(404).send("Module not found");
      return;
    }
    if (
      ![ModuleStatus.Draft, ModuleStatus.Unpublished].includes(
        moduleDoc.status as ModuleStatus,
      )
    ) {
      res.status(403).send("Module not editable in its current state");
      return;
    }
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(500).send(message);
  }
};

export const uploadPictureValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
