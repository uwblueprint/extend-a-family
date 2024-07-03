/* eslint-disable class-methods-use-this */
import {
  CourseUnitDTO,
  CreateCourseUnitDTO,
  UpdateCourseUnitDTO,
} from "../../types/courseTypes";
import logger from "../../utilities/logger";
import ICourseService from "../interfaces/courseService";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class CourseService implements ICourseService {
  async getCourses(): Promise<Array<CourseUnitDTO>> {
    try {
      const courses: Array<CourseUnit> = await MgCourseUnit.find();
      return courses.map((course) => ({
        id: course.id,
        displayIndex: course.displayIndex,
        title: course.title,
        modules: course.modules,
      }));
    } catch (error) {
      Logger.error(
        `Failed to get courses, . Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createCourse(course: CreateCourseUnitDTO): Promise<CourseUnitDTO> {
    let newCourse: CourseUnit | null;
    try {
      const largestDisplayIndexCourse = await MgCourseUnit.findOne().sort({
        displayIndex: -1,
      });
      newCourse = await MgCourseUnit.create({
        ...course,
        displayIndex: largestDisplayIndexCourse
          ? largestDisplayIndexCourse.displayIndex + 1
          : 0,
      });
    } catch (error) {
      Logger.error(
        `Failed to create course units. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: newCourse.id,
      displayIndex: newCourse.displayIndex,
      title: newCourse.title,
      modules: newCourse.modules,
    };
  }

  async updateCourse(id: string, course: UpdateCourseUnitDTO): Promise<CourseUnitDTO> {
    let oldCourse: CourseUnit | null;
    try {
      oldCourse = await MgCourseUnit.findByIdAndUpdate(
        id,
        {
          title: course.title,
        },
        { runValidators: true },
      );

      if (!oldCourse) {
        throw new Error(`Course unit Id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id,
      title: course.title,
      modules: oldCourse.modules,
      displayIndex: oldCourse.displayIndex,
    };
  }

  async deleteCourse(id: string): Promise<string> {
    try {
      const deletedCourseUnit: CourseUnit | null = await MgCourseUnit.findByIdAndDelete(
        id,
      );
      if (!deletedCourseUnit) {
        throw new Error(`Course unit id ${id} not found`);
      }

      // get the index and update the ones behind it
      const { displayIndex } = deletedCourseUnit;
      await MgCourseUnit.updateMany(
        { displayIndex: { $gt: displayIndex } },
        { $inc: { displayIndex: -1 } },
      );

      return id;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default CourseService;
