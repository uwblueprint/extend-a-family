import express, { Request, Response, NextFunction, Router } from "express";
import { isAuthorizedByRole } from "../middlewares/auth";
import CourseModuleModel from "../models/coursemodule.mgmodel";
import { QuestionType } from "../types/activityTypes";
import { ModuleStatus } from "../types/courseTypes";
import activityService from "../services/implementations/activityService";

const activityRouter: Router = express.Router();

// Middleware: ensure module status is Draft or Unpublished
const checkModuleEditable = async (
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
 * Create Activity (Transactional)
 * POST /activities/:moduleId/:questionType
 * Optional body: { index?: number }
 */

activityRouter.post(
  "/:moduleId/:questionType",
  isAuthorizedByRole(new Set(["Administrator"])),
  checkModuleEditable,
  async (req: Request, res: Response): Promise<void> => {
    const { moduleId, questionType } = req.params;
    const { index } = req.body as { index?: number };

    try {
      const result = await activityService.createActivity(
        moduleId,
        questionType as QuestionType,
        index,
      );
      res.status(200).json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Server error";
      if (message === "Module not found") res.status(404).send(message);
      if (message === "Unsupported question type")
        res.status(400).send(message);
      res.status(500).send(message);
    }
  },
);

/**
 * Delete Activity (Transactional)
 * DELETE /activities/:moduleId/:activityId
 */
activityRouter.delete(
  "/:moduleId/:activityId/:questionType",
  isAuthorizedByRole(new Set(["Administrator"])),
  checkModuleEditable,
  async (req: Request, res: Response): Promise<void> => {
    const { moduleId, activityId, questionType } = req.params;

    try {
      const result = await activityService.deleteActivity(
        moduleId,
        activityId,
        questionType as QuestionType,
      );
      res.status(200).json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Server error";
      if (message === "Module not found") {
        res.status(404).send(message);
        return;
      }
      res.status(500).send(message);
    }
  },
);

/**
 * Get Activity
 */
activityRouter.get(
  "/:activityId/:questionType",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const { activityId, questionType } = req.params;
    try {
      const activity = await activityService.getActivity(
        activityId,
        questionType as QuestionType,
      );
      if (!activity) {
        res.status(404).send("Activity not found");
        return;
      }
      res.status(200).json(activity);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Server error";
      res.status(500).send(message);
    }
  },
);

/**
 * Update Activity
 */
activityRouter.patch(
  "/:activityId/:questionType",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req: Request, res: Response): Promise<void> => {
    const { activityId, questionType } = req.params;
    try {
      const updated = await activityService.updateActivity(
        activityId,
        questionType as QuestionType,
        req.body,
      );
      if (!updated) {
        res.status(404).send("Activity not found");
        return;
      }
      res.status(200).json(updated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Server error";
      res.status(500).send(message);
    }
  },
);

export default activityRouter;
