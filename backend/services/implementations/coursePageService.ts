/* eslint-disable class-methods-use-this */
import { startSession } from "mongoose";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";
import MgCoursePage from "../../models/coursepage.mgmodel";
import {
  CoursePageDTO,
  CoursePageDTOBase,
  CreateCoursePageDTO,
  UpdateCoursePageDTO,
} from "../../types/courseTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ICoursePageService from "../interfaces/coursePageService";

const Logger = logger(__filename);

class CoursePageService implements ICoursePageService {
  async getCoursePages(
    courseModuleId: string,
  ): Promise<Array<CoursePageDTOBase>> {
    try {
      const courseModule: CourseModule | null = await MgCourseModule.findById(
        courseModuleId,
      );

      if (!courseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }

      const coursePages = await MgCoursePage.find({
        _id: { $in: courseModule.pages },
      });

      const coursePageDtos = await Promise.all(
        coursePages.map(async (coursePage) => coursePage.toObject()),
      );

      return coursePageDtos;
    } catch (error) {
      Logger.error(
        `Failed to get course pages in course module with id: ${courseModuleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getCoursePage(
    coursePageId: string,
    lean = false,
  ): Promise<CoursePageDTO> {
    try {
      const coursePage = lean
        ? await MgCoursePage.findById(coursePageId).lean().exec()
        : await MgCoursePage.findById(coursePageId);

      if (!coursePage) {
        throw new Error(`id ${coursePageId} not found.`);
      }

      return coursePage;
    } catch (error) {
      Logger.error(
        `Failed to get course page with id: ${coursePageId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createCoursePage(
    courseModuleId: string,
    coursePageDTO: CreateCoursePageDTO,
  ): Promise<CoursePageDTOBase> {
    const session = await startSession();
    session.startTransaction();
    try {
      const newCoursePage = await MgCoursePage.create({
        ...coursePageDTO,
        session,
      });

      await MgCourseModule.findByIdAndUpdate(courseModuleId, {
        $push: { pages: newCoursePage.id },
      }).session(session);

      await session.commitTransaction();

      return newCoursePage.toObject();
    } catch (error) {
      Logger.error(
        `Failed to create new course page for module with id ${courseModuleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateCoursePage(
    coursePageId: string,
    coursePageDTO: UpdateCoursePageDTO,
  ): Promise<CoursePageDTOBase> {
    try {
      const updatedCoursePage = await MgCoursePage.findByIdAndUpdate(
        coursePageId,
        coursePageDTO,
        { runValidators: true, new: true },
      );

      if (!updatedCoursePage) {
        throw new Error(`Course page with id ${coursePageId} not found.`);
      }

      return updatedCoursePage.toObject();
    } catch (error) {
      Logger.error(
        `Failed to update course page with id ${coursePageId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteCoursePage(coursePageId: string): Promise<string> {
    try {
      const deletedCoursePage = await MgCoursePage.findByIdAndDelete(
        coursePageId,
      );

      if (!deletedCoursePage) {
        throw new Error(`Course page with id ${coursePageId} not found.`);
      }

      return deletedCoursePage.id;
    } catch (error) {
      Logger.error(
        `Failed to delete course page with id ${coursePageId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default CoursePageService;
