/* eslint-disable class-methods-use-this */
import {
  CourseUnitDTO,
  CreateCourseUnitDTO,
  UpdateCourseUnitDTO,
} from "../../types/courseTypes";
import logger from "../../utilities/logger";
import ICourseUnitService from "../interfaces/courseUnitService";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class CourseUnitService implements ICourseUnitService {
  async getCourseUnits(): Promise<Array<CourseUnitDTO>> {
    try {
      const courseUnits: Array<CourseUnit> = await MgCourseUnit.find().sort(
        "displayIndex",
      );
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

  async getCourseUnit(
    unitId: string,
  ): Promise<CourseUnitDTO & { modules: string[] }> {
    try {
      const courseUnit: CourseUnit | null = await MgCourseUnit.findById(unitId);

      if (!courseUnit) {
        throw new Error(`Course unit with id ${unitId} not found.`);
      }

      const courseModuleIds = courseUnit.modules.map((id) => {
        return id.toString();
      });

      return { ...(courseUnit as CourseUnitDTO), modules: courseModuleIds };
    } catch (error) {
      Logger.error(
        `Failed to get course with id ${unitId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
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
    id: string,
    courseUnit: UpdateCourseUnitDTO,
  ): Promise<CourseUnitDTO> {
    let oldCourse: CourseUnit | null;
    try {
      oldCourse = await MgCourseUnit.findByIdAndUpdate(
        id,
        {
          title: courseUnit.title,
        },
        { runValidators: true },
      );

      if (!oldCourse) {
        throw new Error(`Course unit with id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id,
      title: courseUnit.title,
      displayIndex: oldCourse.displayIndex,
    };
  }

  async deleteCourseUnit(id: string): Promise<string> {
    try {
      const deletedCourseUnit: CourseUnit | null =
        await MgCourseUnit.findByIdAndDelete(id);
      if (!deletedCourseUnit) {
        throw new Error(`Course unit with id ${id} not found`);
      }

      // get the index and update the ones behind it
      await MgCourseUnit.updateMany(
        { displayIndex: { $gt: deletedCourseUnit.displayIndex } },
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

export default CourseUnitService;
