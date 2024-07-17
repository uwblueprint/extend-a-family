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
  async getCourseUnits(): Promise<Array<CourseUnitDTO>> {
    try {
      const courses: Array<CourseUnit> = await MgCourseUnit.find();
      return courses.map((course) => ({
        id: course.id,
        displayIndex: course.displayIndex,
        title: course.title,
      }));
    } catch (error) {
      Logger.error(
        `Failed to get courses, . Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createCourseUnit(course: CreateCourseUnitDTO): Promise<CourseUnitDTO> {
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
    };
  }

  async updateCourseUnit(
    displayIndex: number,
    course: UpdateCourseUnitDTO,
  ): Promise<CourseUnitDTO> {
    let oldCourse: CourseUnit | null;
    try {
      oldCourse = await MgCourseUnit.findOneAndUpdate(
        { displayIndex },
        {
          title: course.title,
        },
        { runValidators: true },
      );

      if (!oldCourse) {
        throw new Error(
          `Course unit with display index ${displayIndex} not found.`,
        );
      }
    } catch (error) {
      Logger.error(
        `Failed to update course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: oldCourse.id,
      title: course.title,
      displayIndex: oldCourse.displayIndex,
    };
  }

  async deleteCourseUnit(displayIndex: number): Promise<number> {
    try {
      const deletedCourseUnit: CourseUnit | null =
        await MgCourseUnit.findOneAndDelete({ displayIndex });
      if (!deletedCourseUnit) {
        throw new Error(
          `Course unit with display index ${displayIndex} not found`,
        );
      }

      // get the index and update the ones behind it
      await MgCourseUnit.updateMany(
        { displayIndex: { $gt: displayIndex } },
        { $inc: { displayIndex: -1 } },
      );

      return displayIndex;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default CourseService;
