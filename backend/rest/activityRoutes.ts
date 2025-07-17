import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { isAuthorizedByRole } from "../middlewares/auth";
import CourseModuleModel from "../models/coursemodule.mgmodel";
import ActivityModel, {
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
} from "../models/activity.mgmodel";
import { QuestionType } from "../types/activityTypes";
import { ModuleStatus } from "../types/courseTypes";

const router = express.Router();

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
router.post(
  "/:moduleId/:questionType",
  isAuthorizedByRole(new Set(["Administrator"])),
  checkModuleEditable,
  async (req: Request, res: Response): Promise<void> => {
    const { moduleId, questionType } = req.params;
    const { index } = req.body as { index?: number };

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Create empty activity in transaction
      let activity;
      switch (questionType as QuestionType) {
        case QuestionType.MultipleChoice:
          [activity] = await MultipleChoiceActivityModel.create(
            [
              {
                questionType,
                activityNumber: "",
                questionText: "",
                instruction: "",
                options: [],
                correctOption: "",
              },
            ],
            { session },
          );
          break;
        case QuestionType.MultiSelect:
          [activity] = await MultiSelectActivityModel.create(
            [
              {
                questionType,
                activityNumber: "",
                questionText: "",
                instruction: "",
                options: [],
                correctAnswers: [],
              },
            ],
            { session },
          );
          break;
        default:
          res.status(400).send("Unsupported question type");
          await session.abortTransaction();
          session.endSession();
          return;
      }

      // Push into module.pages at index or end
      const pushOp =
        typeof index === "number"
          ? { $each: [activity.id], $position: index }
          : activity.id;

      const updatedModule = await CourseModuleModel.findByIdAndUpdate(
        moduleId,
        { $push: { pages: pushOp } },
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
 * Delete Activity (Transactional)
 * DELETE /activities/:moduleId/:activityId
 */
router.delete(
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
router.get(
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
router.patch(
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

export default router;
