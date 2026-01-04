/* eslint-disable class-methods-use-this */
import { startSession } from "mongoose";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import {
  CourseUnitDTO,
  CreateCourseUnitDTO,
  UpdateCourseUnitDTO,
} from "../../types/courseTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ICourseUnitService from "../interfaces/courseUnitService";
import CourseModuleService from "./courseModuleService";

const Logger = logger(__filename);

class CourseUnitService implements ICourseUnitService {
  private courseModuleService: CourseModuleService;

  constructor() {
    this.courseModuleService = new CourseModuleService();
  }

  async getCourseUnits(): Promise<Array<CourseUnitDTO>> {
    try {
      const courseUnits: Array<CourseUnit> = await MgCourseUnit.find()
        .populate("modules", "title displayIndex")
        .sort("displayIndex");
      return courseUnits.map((courseUnit) => courseUnit.toObject());
    } catch (error) {
      Logger.error(`Failed to get courses. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getCourseUnit(
    unitId: string,
  ): Promise<CourseUnitDTO & { modules: string[] }> {
    const courseUnit: CourseUnit | null = await MgCourseUnit.findById(unitId);

    if (!courseUnit) {
      throw new Error(`Course unit with id ${unitId} not found.`);
    }

    const courseModuleIds = courseUnit.modules.map((id) => {
      return id.toString();
    });

    return { ...courseUnit, modules: courseModuleIds };
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
        await MgCourseUnit.findByIdAndUpdate(id, courseUnit, {
          runValidators: true,
          new: true,
        });

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
    const session = await startSession();
    session.startTransaction();
    try {
      const courseUnit: CourseUnit | null = await MgCourseUnit.findById(
        id,
      ).session(session);
      if (!courseUnit) {
        throw new Error(`Course unit with id ${id} not found`);
      }

      // First, delete all modules within this unit
      // eslint-disable-next-line no-restricted-syntax
      for (const moduleId of courseUnit.modules) {
        // eslint-disable-next-line no-await-in-loop
        await this.courseModuleService.deleteCourseModule(
          id,
          moduleId.toString(),
          session,
        );
      }

      // Now delete the course unit itself
      await MgCourseUnit.findByIdAndDelete(id).session(session);

      // Update displayIndex for remaining units
      await MgCourseUnit.updateMany(
        { displayIndex: { $gt: courseUnit.displayIndex } },
        { $inc: { displayIndex: -1 } },
      ).session(session);

      await session.commitTransaction();
      return id;
    } catch (error: unknown) {
      await session.abortTransaction();
      Logger.error(
        `Failed to delete course unit. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

export default CourseUnitService;
