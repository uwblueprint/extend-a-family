/* eslint-disable class-methods-use-this */
import { startSession } from "mongoose";
import {
  CourseModuleDTO,
  CreateCourseModuleDTO,
  UpdateCourseModuleDTO,
} from "../../types/courseTypes";
import logger from "../../utilities/logger";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";
import ICourseModuleService from "../interfaces/courseModuleService";

const Logger = logger(__filename);

class CourseModuleService implements ICourseModuleService {
  async getCourseModules(
    courseUnitId: string,
  ): Promise<Array<CourseModuleDTO>> {
    try {
      const courseUnit: CourseUnit | null = await MgCourseUnit.findById(
        courseUnitId,
      );

      if (!courseUnit) {
        throw new Error(`Course unit with id ${courseUnitId} not found.`);
      }

      const courseModules: Array<CourseModule> = await MgCourseModule.find({
        _id: { $in: courseUnit.modules },
      });

      return courseModules.map((courseModule) => courseModule.toObject());
    } catch (error) {
      Logger.error(
        `Failed to get course modules for course unit with id: ${courseUnitId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getCourseModule(courseModuleId: string): Promise<CourseModuleDTO> {
    try {
      const courseModule: CourseModule | null = await MgCourseModule.findById(
        courseModuleId,
      );

      if (!courseModule) {
        throw new Error(`id ${courseModuleId} not found.`);
      }

      return courseModule.toObject();
    } catch (error) {
      Logger.error(
        `Failed to get course module with id: ${courseModuleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createCourseModule(
    courseUnitId: string,
    courseModuleDTO: CreateCourseModuleDTO,
  ): Promise<CourseModuleDTO> {
    let newCourseModule: CourseModule | undefined;
    const session = await startSession(); // start a transaction
    session.startTransaction();
    try {
      const courseUnit: CourseUnit | null = await MgCourseUnit.findById(
        courseUnitId,
      ).session(session);

      if (!courseUnit) {
        throw new Error(`Course unit with id ${courseUnitId} not found.`);
      }
      const numCourseModules = courseUnit.modules.length;

      newCourseModule = await MgCourseModule.create({
        ...courseModuleDTO,
        displayIndex: numCourseModules + 1,
        session,
      });

      if (!newCourseModule) {
        throw new Error(
          `Error with creating course module with DTO: ${courseModuleDTO}`,
        );
      }

      await MgCourseUnit.findByIdAndUpdate(courseUnitId, {
        $push: { modules: newCourseModule.id }, // newModule is the object/value you want to push into the array
      }).session(session);

      await session.commitTransaction();
    } catch (error) {
      Logger.error(
        `Failed to create course module under course unit with id: ${courseUnitId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    } finally {
      session.endSession();
    }

    return {
      id: newCourseModule.id,
      displayIndex: newCourseModule.displayIndex,
      title: newCourseModule.title,
    } as CourseModuleDTO;
  }

  async updateCourseModule(
    courseModuleId: string,
    courseModuleDTO: UpdateCourseModuleDTO,
  ): Promise<CourseModuleDTO> {
    let updatedModule: CourseModule | null;
    try {
      updatedModule = await MgCourseModule.findByIdAndUpdate(
        courseModuleId,
        {
          title: courseModuleDTO.title,
        },
        { new: true, runValidators: true },
      );

      if (!updatedModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update course module. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: updatedModule.id,
      title: updatedModule.title,
      displayIndex: updatedModule.displayIndex,
    } as CourseModuleDTO;
  }

  async deleteCourseModule(
    courseUnitId: string,
    courseModuleId: string,
  ): Promise<string> {
    let deletedCourseModuleId: string;
    const session = await startSession();
    session.startTransaction();
    try {
      // first update the course units module reference
      const courseUnit = await MgCourseUnit.findByIdAndUpdate(
        courseUnitId,
        {
          $pull: { modules: courseModuleId },
        },
        { new: true, runValidators: true },
      ).session(session);

      if (!courseUnit) {
        throw new Error(`Course unit with id ${courseUnitId} not found`);
      }

      // then find ID of course module and delete
      const deletedCourseModule: CourseModule | null =
        await MgCourseModule.findByIdAndDelete(courseModuleId).session(session);
      if (!deletedCourseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found`);
      }

      deletedCourseModuleId = deletedCourseModule.id;
      // get the index and update the ones behind it
      await MgCourseModule.updateMany(
        { displayIndex: { $gt: deletedCourseModule.displayIndex } },
        { $inc: { displayIndex: -1 } },
      ).session(session);

      await session.commitTransaction();
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete course module. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      await session.endSession();
    }

    return deletedCourseModuleId;
  }
}

export default CourseModuleService;
