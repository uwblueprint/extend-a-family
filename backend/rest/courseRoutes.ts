import { Router } from "express";
import CourseService from "../services/implementations/courseService";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CourseUnitDTO } from "../types/courseTypes";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  createCourseUnitDtoValidator,
  updateCourseUnitDtoValidator,
} from "../middlewares/validators/courseValidators";
import { isAuthorizedByRole } from "../middlewares/auth";

const courseRouter: Router = Router();
const courseService: CourseService = new CourseService();

courseRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const contentType = req.headers["content-type"];
    try {
      const courses = await courseService.getCourses();
      await sendResponseByMimeType<CourseUnitDTO>(
        res,
        200,
        contentType,
        courses,
      );
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
      const newCourse = await courseService.createCourse({
        title: req.body.title,
      });
      res.status(201).json(newCourse);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.put(
  "/:id",
  isAuthorizedByRole(new Set(["Administrator"])),
  updateCourseUnitDtoValidator,
  async (req, res) => {
    const { id } = req.params;
    try {
      const course = await courseService.updateCourse(id, {
        title: req.body.title,
      });
      res.status(200).json(course);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

courseRouter.delete(
  "/:id",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedId = await courseService.deleteCourse(id);
      res.status(200).json({ id: deletedId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

export default courseRouter;
