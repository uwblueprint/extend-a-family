import { Router } from "express";
import multer from "multer";
import { getAccessToken, isAuthorizedByRole } from "../middlewares/auth";
import {
  coursePageDtoValidator,
  createCourseUnitDtoValidator,
  moduleBelongsToUnitValidator,
  moduleThumbnailValidator,
  pageBelongsToModuleValidator,
  updateCourseUnitDtoValidator,
} from "../middlewares/validators/courseValidators";
import CourseModuleService from "../services/implementations/courseModuleService";
import CoursePageService from "../services/implementations/coursePageService";
import CourseUnitService from "../services/implementations/courseUnitService";
import FileStorageService from "../services/implementations/fileStorageService";
import LearnerProgressService from "../services/implementations/learnerProgressService";
import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";
import { CourseUnitDTO } from "../types/courseTypes";
import { getErrorMessage } from "../utilities/errorUtils";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const courseRouter: Router = Router({ mergeParams: true });
const courseUnitService: CourseUnitService = new CourseUnitService();
const courseModuleService: CourseModuleService = new CourseModuleService();
const coursePageService: CoursePageService = new CoursePageService();
const firebaseStorageService: FileStorageService = new FileStorageService(
  process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "",
);
const userService = new UserService();
const emailService = new EmailService(nodemailerConfig);
const authService = new AuthService(userService, emailService);
const progressService = new LearnerProgressService();

courseRouter.post(
  "/:moduleId/uploadThumbnail",
  upload.single("uploadedImage"),
  moduleThumbnailValidator,
  async (req, res) => {
    const { moduleId } = req.params;
    const imageData = req.file?.buffer;
    const contentType = req.file?.mimetype;
    const imageName: string = `course/thumbnails/${moduleId}`;

    try {
      const imageURL: string = await firebaseStorageService.uploadImage(
        imageName,
        imageData,
        contentType,
      );

      const module = await courseModuleService.getCourseModule(moduleId);

      if (!module) {
        throw new Error(`Course module with id ${moduleId} not found.`);
      }

      await courseModuleService.updateCourseModule(moduleId, {
        ...module,
        imageURL,
      });

      res.status(200).json(imageURL);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.put(
  "/rearangeUnits",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator"])),
  async (req, res) => {
    try {
      const arangement: Map<string, number> = new Map<string, number>(
        Object.entries(req.body.arangement),
      );
      const courseUnits = await courseUnitService.getCourseUnits();
      const updatedUnits: CourseUnitDTO[] = [];
      const maxIndex: number = courseUnits.length;
      const testSet: Set<number> = new Set();
      arangement.forEach((value, key) => {
        if (value > maxIndex || value < 1) {
          throw Error("invalid arangement");
        }
        const unit: CourseUnitDTO | undefined = courseUnits.find(
          (units) => units.id === key,
        );
        if (unit) {
          unit.displayIndex = value;
          updatedUnits.push(unit);
        } else {
          throw Error("invalid arangement");
        }
      });
      courseUnits.forEach((unit) => {
        testSet.add(unit.displayIndex);
      });
      if (testSet.size !== maxIndex) {
        throw Error("invalid arangement");
      }
      await Promise.all(
        updatedUnits.map((unit) =>
          courseUnitService.updateCourseUnit(unit.id, unit),
        ),
      );
      res.status(200).send("success");
    } catch (error: unknown) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

courseRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    try {
      const courses = await courseUnitService.getCourseUnits();
      res.status(200).json(courses);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.post(
  "/uploadLessons",
  upload.single("lessonPdf"),
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    try {
      const {
        file: lessonPdf,
        body: { moduleId, insertIdx },
      } = req;
      if (!lessonPdf) {
        throw new Error("No lessonPdf file uploaded.");
      }
      const result = await courseModuleService.uploadLessons(
        moduleId,
        lessonPdf.buffer,
        insertIdx ? parseInt(insertIdx, 10) : undefined,
      );
      res.status(200).json(result);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

/**
 * GET /course/module/:moduleId
 * Get a single module. For learners, includes module progress.
 */
courseRouter.get(
  "/module/:moduleId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    const { moduleId } = req.params;
    const accessToken = getAccessToken(req);

    try {
      const courseModule = await courseModuleService.getCourseModule(moduleId);

      // For learners, include module progress
      if (accessToken) {
        try {
          const userId = await authService.getUserIdFromAccessToken(
            accessToken,
          );
          const user = await userService.getUserById(userId.toString());
          if (user.role === "Learner") {
            const moduleProgress = await progressService.getModuleProgress(
              userId.toString(),
              moduleId,
            );
            res.status(200).json({
              ...courseModule,
              progress: moduleProgress,
            });
            return;
          }
        } catch {
          // If we can't get progress, just return module without it
        }
      }

      res.status(200).json(courseModule);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

/**
 * GET /course/:unitId
 * Get all modules in a unit. For learners, includes progress for each module.
 */
courseRouter.get(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    const accessToken = getAccessToken(req);

    try {
      const courseModules = await courseModuleService.getCourseModules(
        req.params.unitId,
      );

      // For learners, include module progress for each module
      if (accessToken) {
        try {
          const userId = await authService.getUserIdFromAccessToken(
            accessToken,
          );
          const user = await userService.getUserById(userId.toString());
          if (user.role === "Learner") {
            const modulesWithProgress = await Promise.all(
              courseModules.map(async (module) => {
                const moduleProgress = await progressService.getModuleProgress(
                  userId.toString(),
                  module.id,
                );
                return {
                  ...module,
                  progress: moduleProgress,
                };
              }),
            );
            res.status(200).json(modulesWithProgress);
            return;
          }
        } catch {
          // If we can't get progress, just return modules without it
        }
      }

      res.status(200).json(courseModules);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.post(
  "/",
  isAuthorizedByRole(new Set(["Administrator"])),
  createCourseUnitDtoValidator,
  async (req, res) => {
    try {
      const newUnit = await courseUnitService.createCourseUnit({
        title: req.body.title,
      });
      res.status(201).json(newUnit);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.post(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator"])),
  createCourseUnitDtoValidator,
  async (req, res) => {
    try {
      const newCourseModule = await courseModuleService.createCourseModule(
        req.params.unitId,
        {
          title: req.body.title,
        },
      );
      res.status(201).json(newCourseModule);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.put(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator"])),
  updateCourseUnitDtoValidator,
  async (req, res) => {
    const { unitId } = req.params;
    try {
      const updatedUnit = await courseUnitService.updateCourseUnit(unitId, {
        title: req.body.title,
      });
      res.status(200).json(updatedUnit);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.put(
  "/:unitId/reorderModules",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { unitId } = req.params;
    try {
      const orderedModuleIds: string[] = req.body.moduleIds;

      if (!Array.isArray(orderedModuleIds)) {
        throw Error("Invalid request: moduleIds must be an array");
      }

      const courseModules = await courseModuleService.getCourseModules(unitId);

      // Validate that all modules belong to the unit and no duplicates
      if (orderedModuleIds.length !== courseModules.length) {
        throw Error("Invalid arrangement: module count mismatch");
      }

      const moduleIdSet = new Set(orderedModuleIds);
      if (moduleIdSet.size !== orderedModuleIds.length) {
        throw Error("Invalid arrangement: duplicate module IDs");
      }

      // Validate all modules belong to the unit
      const invalidModule = orderedModuleIds.find(
        (moduleId) => !courseModules.some((mod) => mod.id === moduleId),
      );
      if (invalidModule) {
        throw Error(
          `Invalid arrangement: module ${invalidModule} not found in unit`,
        );
      }

      // Update the modules array in the unit to reflect new order
      await courseUnitService.updateCourseUnit(unitId, {
        modules: orderedModuleIds,
      });

      res.status(200).send("success");
    } catch (error: unknown) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

courseRouter.put(
  "/:unitId/:moduleId",
  isAuthorizedByRole(new Set(["Administrator"])),
  updateCourseUnitDtoValidator,
  moduleBelongsToUnitValidator,
  async (req, res) => {
    const { moduleId } = req.params;
    try {
      const updatedCourseModule = await courseModuleService.updateCourseModule(
        moduleId,
        {
          title: req.body.title,
        },
      );
      res.status(200).json(updatedCourseModule);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.delete(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { unitId } = req.params;
    try {
      const deletedCourseUnitId = await courseUnitService.deleteCourseUnit(
        unitId,
      );
      res.status(200).json({ id: deletedCourseUnitId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.delete(
  "/:unitId/:moduleId",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  async (req, res) => {
    const { unitId, moduleId, deleteFeedbacks } = req.params;
    try {
      const deletedCourseUnitId = await courseModuleService.deleteCourseModule(
        unitId,
        moduleId,
        undefined,
        deleteFeedbacks === "true",
      );
      res.status(200).json({ id: deletedCourseUnitId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.get(
  "/:unitId/:moduleId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  moduleBelongsToUnitValidator,
  async (req, res) => {
    try {
      const coursePages = await coursePageService.getCoursePages(
        req.params.moduleId,
      );
      res.status(200).json(coursePages);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.post(
  "/:unitId/:moduleId",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  coursePageDtoValidator,
  async (req, res) => {
    try {
      const newCoursePage = await coursePageService.createCoursePage(
        req.params.moduleId,
        req.body,
      );
      res.status(200).json(newCoursePage);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.put(
  "/:unitId/:moduleId/:pageId",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  pageBelongsToModuleValidator,
  coursePageDtoValidator,
  async (req, res) => {
    try {
      const updatedCoursePage = await coursePageService.updateCoursePage(
        req.params.pageId,
        req.body,
      );
      res.status(200).json(updatedCoursePage);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.delete(
  "/module/:moduleId/:pageId",
  isAuthorizedByRole(new Set(["Administrator"])),
  pageBelongsToModuleValidator,
  async (req, res) => {
    try {
      const deletedCoursePageId = await coursePageService.deleteCoursePage(
        req.params.moduleId,
        req.params.pageId,
      );
      res.status(200).json({ id: deletedCoursePageId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.patch(
  "/module/:moduleId/reorder",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { moduleId } = req.params;
    const { fromIndex, toIndex } = req.body;

    try {
      if (
        typeof fromIndex !== "number" ||
        typeof toIndex !== "number" ||
        fromIndex < 0 ||
        toIndex < 0
      ) {
        res.status(400).send("Invalid fromIndex or toIndex");
        return;
      }

      const updatedModule = await courseModuleService.reorderPages(
        moduleId,
        fromIndex,
        toIndex,
      );
      res.status(200).json(updatedModule);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.delete(
  "/:unitId/:moduleId/:pageId",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  pageBelongsToModuleValidator,
  async (req, res) => {
    try {
      const deletedCoursePageId = await coursePageService.deleteCoursePage(
        req.params.moduleId,
        req.params.pageId,
      );
      res.status(200).json({ id: deletedCoursePageId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.patch(
  "/:moduleId/publish",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { moduleId } = req.params;
    const { oldFeedbackDecision } = req.body;
    try {
      const updated = await courseModuleService.publishCourseModule(
        moduleId,
        oldFeedbackDecision,
      );
      res.json(updated);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.patch(
  "/:moduleId/unpublish",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { moduleId } = req.params;
    try {
      const updated = await courseModuleService.unpublishCourseModule(moduleId);
      res.json(updated);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

export default courseRouter;
