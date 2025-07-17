import express, { Request, Response, NextFunction, Router } from "express";
import mongoose from "mongoose";
import { isAuthorizedByRole } from "../middlewares/auth";
import CourseModuleModel from "../models/coursemodule.mgmodel";
import ActivityModel from "../models/activity.mgmodel";
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
  "/:moduleId/:activityId",
  isAuthorizedByRole(new Set(["Administrator"])),
  checkModuleEditable,
  async (req: Request, res: Response): Promise<void> => {
    const { moduleId, activityId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Remove from activity collection
      await ActivityModel.findByIdAndDelete(activityId, { session });
      // Pull from module.pages
      const updatedModule = await CourseModuleModel.findByIdAndUpdate(
        moduleId,
        { $pull: { pages: activityId } },
        { new: true, session },
      ).lean();

      if (!updatedModule) {
        res.status(404).send("Module not found");
        await session.abortTransaction();
        session.endSession();
        return;
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ pages: updatedModule.pages });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      const message = e instanceof Error ? e.message : "Server error";
      res.status(500).send(message);
    }
  },
);

/**
 * Get Activity
 */
activityRouter.get(
  "/:activityId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req: Request, res: Response): Promise<void> => {
    const { activityId } = req.params;
    try {
      const activity = await ActivityModel.findById(activityId).lean();
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
  "/:activityId",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req: Request, res: Response): Promise<void> => {
    const { activityId } = req.params;
    try {
      const updated = await ActivityModel.findByIdAndUpdate(
        activityId,
        req.body,
        { new: true, runValidators: true },
      ).lean();
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
