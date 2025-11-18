import express, { Request, Response, Router } from "express";
import multer from "multer";
import { isAuthorizedByRole } from "../middlewares/auth";
import {
  checkModuleEditable,
  uploadPictureValidator,
  checkActivityEditable,
} from "../middlewares/validators/activityValidators";
import activityService from "../services/implementations/activityService";
import FileStorageService from "../services/implementations/fileStorageService";
import IFileStorageService from "../services/interfaces/fileStorageService";
import { QuestionType } from "../types/activityTypes";
import { getErrorMessage } from "../utilities/errorUtils";

const activityRouter: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const firebaseStorageService: IFileStorageService = new FileStorageService(
  process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "",
);

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
      if (message === "Module not found") {
        res.status(404).send(message);
        return;
      }
      if (message === "Unsupported question type") {
        res.status(400).send(message);
        return;
      }
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
  checkActivityEditable,
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

activityRouter.patch(
  "/:activityId/:questionType/UpdateMainPicture",
  upload.single("uploadedImage"),
  isAuthorizedByRole(new Set(["Administrator"])),
  checkActivityEditable,
  uploadPictureValidator,
  async (req, res) => {
    const imageData = req.file!.buffer!; // Non-null assertion as validated by middleware
    const contentType = req.file!.mimetype!;
    const { activityId, questionType } = req.params;
    const imageName = `activity/imageData/${activityId}`;

    try {
      const imageUrl: string = await firebaseStorageService.uploadImage(
        imageName,
        imageData,
        contentType,
      );
      const updatedActivity = await activityService.updateActivity(
        activityId,
        questionType as QuestionType,
        { imageUrl },
      );
      res.status(200).json(updatedActivity);
    } catch (error: unknown) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

export default activityRouter;
