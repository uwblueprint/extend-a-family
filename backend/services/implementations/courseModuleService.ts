/* eslint-disable class-methods-use-this */
import fs from "fs/promises";
import { startSession } from "mongoose";
import { PDFDocument } from "pdf-lib";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";
import { LessonPageModel } from "../../models/coursepage.mgmodel";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import {
  CourseModuleDTO,
  CreateCourseModuleDTO,
  UpdateCourseModuleDTO,
} from "../../types/courseTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ICourseModuleService from "../interfaces/courseModuleService";
import IFileStorageService from "../interfaces/fileStorageService";
import FileStorageService from "./fileStorageService";

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);
const Logger = logger(__filename);

class CourseModuleService implements ICourseModuleService {
  private fileStorageService: FileStorageService;

  constructor() {
    this.fileStorageService = new FileStorageService(
      process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "",
    );
  }

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

  async getCourseModule(
    courseModuleId: string,
  ): Promise<CourseModuleDTO | null> {
    try {
      const courseModule: CourseModule | null = await MgCourseModule.findById(
        courseModuleId,
      );
      if (!courseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }
      const lessonPdfUrl: string | undefined = await fileStorageService.getFile(
        `course/pdf/module-${courseModuleId}.pdf`,
      );
      return {
        ...courseModule,
        lessonPdfUrl,
        pages: courseModule.pages.map((page) => page.toString()),
      };
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
          imageURL: courseModuleDTO.imageURL,
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

  async uploadLessons(
    moduleId: string,
    pdfPath: string,
  ): Promise<CourseModuleDTO> {
    const session = await startSession();
    session.startTransaction();

    try {
      // 1. Find the module
      const courseModule = await MgCourseModule.findById(moduleId).session(
        session,
      );
      if (!courseModule) {
        throw new Error(`Course module with id ${moduleId} not found`);
      }

      // 2. Read and process the PDF
      const pdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const numPages = pdfDoc.getPageCount();

      // 3. Upload PDF to Firebase Storage
      const pdfFileName = `course/pdfs/module-${moduleId}.pdf`;
      await this.fileStorageService.createFile(
        pdfFileName,
        pdfPath,
        "application/pdf",
        true,
      );

      // 4. Create lesson pages using LessonPageModel
      const createdPages: Array<string> = [];
      for (let i = 0; i < numPages; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const newPage = await LessonPageModel.create(
          [
            {
              // Note: Wrapped in array as per Mongoose v7+ requirements
              title: `Page ${i + 1}`,
              displayIndex: courseModule.pages.length + i + 1,
              type: "Lesson",
              source: pdfFileName,
              pageIndex: i,
            },
          ],
          { session },
        );
        createdPages.push(newPage[0].id); // Access first element and get _id
      }

      // 5. Update module with new pages
      const updatedModule = await MgCourseModule.findByIdAndUpdate(
        moduleId,
        { $push: { pages: { $each: createdPages } } }, // createdPages is already array of IDs
        { new: true, session },
      );

      if (!updatedModule) {
        throw new Error(
          `Course module with id ${moduleId} not found during update`,
        );
      }

      await session.commitTransaction();

      return {
        id: updatedModule.id,
        displayIndex: updatedModule.displayIndex,
        title: updatedModule.title,
      } as CourseModuleDTO;
    } catch (error) {
      await session.abortTransaction();
      Logger.error(
        `Failed to upload lessons for module ${moduleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default CourseModuleService;
