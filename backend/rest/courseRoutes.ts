import { Router } from "express";
import multer from "multer";
import CourseUnitService from "../services/implementations/courseUnitService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  createCourseUnitDtoValidator,
  moduleBelongsToUnitValidator,
  updateCourseUnitDtoValidator,
} from "../middlewares/validators/courseValidators";
import { isAuthorizedByRole } from "../middlewares/auth";
import CourseModuleService from "../services/implementations/courseModuleService";
import FileStorageService from "../services/implementations/fileStorageService";
import { CourseModuleDTO } from "../types/courseTypes"

const storage = multer.memoryStorage();
const upload = multer({ storage });

const courseRouter: Router = Router();
const courseUnitService: CourseUnitService = new CourseUnitService();
const courseModuleService: CourseModuleService = new CourseModuleService();
const firebaseStorageService: FileStorageService = new FileStorageService(
  process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || ""
);

// courseRouter.get(
//   "/:unitId/getImages",
//   async (req, res) => {
//     const { unitId } = req.params;
//     var images: string[] = [];
//     try {
//       let courseModules: CourseModuleDTO[] = await courseModuleService.getCourseModules(unitId)
//       for (const module of courseModules) {
//         const expDate: any = module.expirationDate;
//         let imageURL: string = "";
//         if (expDate?.getTime() < Date.now()) {
//           imageURL = await firebaseStorageService.getFile(`course/thumbnails/${module.id}`, 144400);
//           const newDate = new Date();
//           newDate.setDate(newDate.getDate() + 100);
//           const updatedModule: CourseModuleDTO = {...module, imageURL: imageURL, expirationDate: newDate};
//           await courseModuleService.updateCourseModule(module.id, updatedModule);
//         } else if(module.imageURL) {
//           imageURL = module.imageURL;
//         }
//         images.push(imageURL);
//       }
//       res.status(200).json(images)
//     } catch(e:unknown) {
//       res.status(400).json(getErrorMessage(e))
//     }
   
//   }
// );

courseRouter.post(
  "/:moduleId/uploadThumbnail",
  upload.single("uploadedImage"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "image is missing" });
      return;
    }
    const { moduleId } = req.params;
    const imageData: Buffer = req.file?.buffer;
    const contentType: string = req.file?.mimetype;
    const imageName: string = `course/thumbnails/${moduleId}`;
    try {
      const imageURL: string = await firebaseStorageService.uploadImage(
        imageName,
        imageData,
        contentType,
      );
      let module: CourseModuleDTO = await courseModuleService.getCourseModule(moduleId)
      console.log(module)
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 100);
      const updatedModule: CourseModuleDTO = {...module, imageURL: imageURL, expirationDate: newDate};
      await courseModuleService.updateCourseModule(moduleId, updatedModule)
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

courseRouter.get(
  "/:unitId",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    try {
      const courseModules = await courseModuleService.getCourseModules(
        req.params.unitId,
      );

      for (let module of courseModules) {
        if (module.expirationDate && module.expirationDate?.getTime() < Date.now()) {
          let imageURL: string = await firebaseStorageService.getFile(`course/thumbnails/${module.id}`, 144400);
          const newDate = new Date();
          newDate.setDate(newDate.getDate() + 100);
          await courseModuleService.updateCourseModule(module.id, {...module, imageURL: imageURL, expirationDate: newDate});
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
      const newCourse = await courseUnitService.createCourseUnit({
        title: req.body.title,
      });
      res.status(201).json(newCourse);
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
      const course = await courseUnitService.updateCourseUnit(unitId, {
        title: req.body.title,
      });
      res.status(200).json(course);
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





export default courseRouter;
