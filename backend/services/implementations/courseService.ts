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
      const courseUnits: Array<CourseUnit> = await MgCourseUnit.find();
      return courseUnits.map((courseUnit) => ({
        id: courseUnit.id,
        displayIndex: courseUnit.displayIndex,
        title: courseUnit.title,
      }));
    } catch (error) {
      Logger.error(`Failed to get courses. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createCourseUnit(
    courseUnit: CreateCourseUnitDTO,
  ): Promise<CourseUnitDTO> {
    let newCourseUnit: CourseUnit | null;
    try {
      const numCourseUnits = await MgCourseUnit.countDocuments();
      newCourseUnit = await MgCourseUnit.create({
        ...courseUnit,
        displayIndex: numCourseUnits + 1,
      });
    } catch (error) {
      Logger.error(
        `Failed to create course units. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: newCourseUnit.id,
      displayIndex: newCourseUnit.displayIndex,
      title: newCourseUnit.title,
    };
  }

  async updateCourseUnit(
    displayIndex: number,
    courseUnit: UpdateCourseUnitDTO,
  ): Promise<CourseUnitDTO> {
    let oldCourse: CourseUnit | null;
    try {
      oldCourse = await MgCourseUnit.findOneAndUpdate(
        { displayIndex },
        {
          title: courseUnit.title,
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
      title: courseUnit.title,
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
