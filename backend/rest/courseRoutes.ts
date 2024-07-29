import { Router } from "express";
import CourseService from "../services/implementations/courseService";
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
    try {
      const courses = await courseService.getCourseUnits();
      res.status(200).json(courses);
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
      const newCourse = await courseService.createCourseUnit({
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
      const course = await courseService.updateCourseUnit(id, {
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
      const deletedCourseUnitId = await courseService.deleteCourseUnit(id);
      res.status(200).json({ id: deletedCourseUnitId });
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

export default courseRouter;
