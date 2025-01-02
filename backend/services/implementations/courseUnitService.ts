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
      return courseUnits.map((courseUnit) => courseUnit.toObject());
    } catch (error) {
      Logger.error(`Failed to get courses. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getCourseUnit(unitId: string): Promise<CourseUnitDTO> {
    try {
      const courseUnit: CourseUnit | null = await MgCourseUnit.findById(unitId);

      if (!courseUnit) {
        throw new Error(`Course unit with id ${unitId} not found.`);
      }

      return courseUnit.toObject();
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
    return newCourseUnit.toObject();
  }

  async updateCourseUnit(
    id: string,
    courseUnit: UpdateCourseUnitDTO,
  ): Promise<CourseUnitDTO> {
    try {
      const updatedCourseUnit: CourseUnit | null =
        await MgCourseUnit.findByIdAndUpdate(
          id,
          {
            title: courseUnit.title,
          },
          { runValidators: true, new: true },
        );

      if (!updatedCourseUnit) {
        throw new Error(`Course unit with id ${id} not found.`);
      }
      return updatedCourseUnit.toObject();
    } catch (error) {
      Logger.error(
        `Failed to update course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
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
