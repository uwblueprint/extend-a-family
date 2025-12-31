/* eslint-disable class-methods-use-this */
import { startSession } from "mongoose";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";
import MgCoursePage from "../../models/coursepage.mgmodel";
import {
  CoursePageDTO,
  CreateCoursePageDTO,
  UpdateCoursePageDTO,
} from "../../types/courseTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ICoursePageService from "../interfaces/coursePageService";

const Logger = logger(__filename);

class CoursePageService implements ICoursePageService {
  async getCoursePages(courseModuleId: string): Promise<Array<CoursePageDTO>> {
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
  ): Promise<CoursePageDTO> {
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
  ): Promise<CoursePageDTO> {
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

  async deleteCoursePage(
    courseModuleId: string,
    coursePageId: string,
  ): Promise<string> {
    const session = await startSession();
    session.startTransaction();
    try {
      const courseModule = await MgCourseModule.findById(
        courseModuleId,
      ).session(session);

      if (!courseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }

      const pageIndex = courseModule.pages.findIndex(
        (pageId) => pageId.toString() === coursePageId,
      );

      if (pageIndex === -1) {
        throw new Error(
          `Course page with id ${coursePageId} not found in module ${courseModuleId}.`,
        );
      }

      const deletedCoursePage = await MgCoursePage.findByIdAndDelete(
        coursePageId,
      ).session(session);

      if (!deletedCoursePage) {
        throw new Error(`Course page with id ${coursePageId} not found.`);
      }

      await MgCourseModule.findByIdAndUpdate(courseModuleId, {
        $pull: { pages: coursePageId },
      }).session(session);

      await session.commitTransaction();

      return deletedCoursePage.id;
    } catch (error) {
      await session.abortTransaction();
      Logger.error(
        `Failed to delete course page with id ${coursePageId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default CoursePageService;
