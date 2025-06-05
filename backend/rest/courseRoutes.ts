import { Router } from "express";
import fs from "fs";
import multer from "multer";
import { isAuthorizedByRole } from "../middlewares/auth";
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
  multer({ storage: multer.memoryStorage() }).single("lessonPdf"),
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    try {
      const {
        file: lessonPdf,
        body: { moduleId },
      } = req;
      if (!lessonPdf) {
        throw new Error("No lessonPdf file uploaded.");
      }
      const uploadedLessonPath = `uploads/course/pdfs/module-${moduleId}.pdf`;
      if (!fs.existsSync(uploadedLessonPath)) {
        fs.mkdirSync("uploads/course/pdfs", { recursive: true });
      }
      fs.writeFile(uploadedLessonPath, lessonPdf.buffer, (err) => {
        if (err) {
          throw err;
        }
      });
      const result = await courseModuleService.uploadLessons(
        moduleId,
        uploadedLessonPath,
      );
      res.status(200).json(result);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.get(
  "/module/:moduleId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    const { moduleId } = req.params;
    try {
      const courseModule = await courseModuleService.getCourseModule(moduleId);
      res.status(200).json(courseModule);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.get(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    try {
      const courseModules = await courseModuleService.getCourseModules(
        req.params.unitId,
      );
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
    const { unitId, moduleId } = req.params;
    try {
      const deletedCourseUnitId = await courseModuleService.deleteCourseModule(
        unitId,
        moduleId,
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
  "/:unitId/:moduleId/:pageId",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    try {
      const deletedCoursePageId = await coursePageService.deleteCoursePage(
        req.params.pageId,
      );
      res.status(200).json({ id: deletedCoursePageId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.patch(
  "/:unitId/:moduleId/publish",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  async (req, res, next) => {
    const { unitId, moduleId } = req.params;
    try {
      const updated = await courseModuleService.publishCourseModule(
        unitId,
        moduleId,
      );
      res.json(updated);
    } catch (e) {
      next(e);
    }
  },
);

courseRouter.patch(
  "/:unitId/:moduleId/unpublish",
  isAuthorizedByRole(new Set(["Administrator"])),
  moduleBelongsToUnitValidator,
  async (req, res, next) => {
    const { unitId, moduleId } = req.params;
    try {
      const updated = await courseModuleService.unpublishCourseModule(
        unitId,
        moduleId,
      );
      res.json(updated);
    } catch (e) {
      next(e);
    }
  },
);

export default courseRouter;
