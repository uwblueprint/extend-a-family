/* eslint-disable class-methods-use-this */
import fs from "fs/promises";
import mongoose, { ClientSession, Schema, startSession } from "mongoose";
import { PDFDocument } from "pdf-lib";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";
import CoursePageModel, {
  CoursePage,
  LessonPageModel,
} from "../../models/coursepage.mgmodel";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import {
  CourseModuleDTO,
  CreateCourseModuleDTO,
  UpdateCourseModuleDTO,
  ModuleStatus,
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

/**
 * Allowed transitions for the module status finite‑state machine.
 */
const validTransitions: Record<ModuleStatus, ReadonlyArray<ModuleStatus>> = {
  [ModuleStatus.Draft]: [ModuleStatus.Published],
  [ModuleStatus.Published]: [ModuleStatus.Unpublished],
  [ModuleStatus.Unpublished]: [ModuleStatus.Published],
};

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
      )
        .lean()
        .exec();
      if (!courseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }

      // Find the unit that contains this module
      const courseUnit = await MgCourseUnit.findOne({
        modules: courseModuleId,
      })
        .lean()
        .exec();

      if (!courseUnit) {
        throw new Error(
          `No unit found containing module with id ${courseModuleId}`,
        );
      }

      const lessonPdfUrl: string | undefined = await fileStorageService.getFile(
        `course/pdfs/module-${courseModuleId}.pdf`,
      );
      const fetchPage = async (page: Schema.Types.ObjectId): Promise<CoursePage> => {
        const pageObject = await CoursePageModel.findById(page).lean().exec();
        if (!pageObject) {
          throw new Error(`Page with id ${page} not found.`);
        }
        return pageObject;
      };
      const pageObjects = Promise.all(courseModule.pages.map(fetchPage));
      return {
        ...courseModule,
        unitId: courseUnit._id.toString(), // eslint-disable-line no-underscore-dangle
        lessonPdfUrl,
        pages: await pageObjects,
      } as CourseModuleDTO;
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
        // default status is draft; rely on schema default but keep explicit for clarity
        status: ModuleStatus.Draft,
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
      status: newCourseModule.status as ModuleStatus,
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
      status: updatedModule.status as ModuleStatus,
    } as CourseModuleDTO;
  }

  async deleteCourseModule(
    courseUnitId: string,
    courseModuleId: string,
    currSession?: ClientSession,
  ): Promise<string> {
    let deletedCourseModuleId: string;
    const session: ClientSession = currSession ?? (await startSession());
    if (!currSession) {
      session.startTransaction();
    }
    try {
      // Find the module to get its pages
      const courseModule = await MgCourseModule.findById(
        courseModuleId,
      ).session(session);
      if (!courseModule) {
        throw new Error(`Course module with id ${courseModuleId} not found.`);
      }
      // Delete all pages within the module
      await CoursePageModel.deleteMany({
        _id: { $in: courseModule.pages },
      }).session(session);

      // Remove the module reference from the unit
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

      if (!currSession) {
        await session.commitTransaction();
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete course module. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      if (!currSession) {
        await session.endSession();
      }
    }

    return deletedCourseModuleId;
  }

  /**
   * Publish a module (Draft → Published or Unpublished → Published).
   */
  async publishCourseModule(
    courseUnitId: string,
    moduleId: string,
  ): Promise<CourseModuleDTO> {
    return this.changeStatus(courseUnitId, moduleId, ModuleStatus.Published);
  }

  /**
   * Unpublish a module (Published → Unpublished).
   */
  async unpublishCourseModule(
    courseUnitId: string,
    moduleId: string,
  ): Promise<CourseModuleDTO> {
    return this.changeStatus(courseUnitId, moduleId, ModuleStatus.Unpublished);
  }

  /**
   * Internal helper that validates state transitions.
   */
  private async changeStatus(
    courseUnitId: string,
    moduleId: string,
    newStatus: ModuleStatus,
  ): Promise<CourseModuleDTO> {
    const session = await startSession();
    session.startTransaction();
    try {
      const courseUnit = await MgCourseUnit.findById(courseUnitId).session(
        session,
      );
      const newModuleId = new mongoose.Types.ObjectId(moduleId);

      const belongsToUnit = courseUnit?.modules.some((m) =>
        (m as unknown as mongoose.Types.ObjectId).equals(newModuleId),
      );
      if (!courseUnit || !belongsToUnit) {
        throw new Error("Module not found in specified unit");
      }

      const module = await MgCourseModule.findById(moduleId).session(session);
      if (!module) {
        throw new Error("Module not found");
      }

      if (
        !validTransitions[module.status as ModuleStatus].includes(newStatus)
      ) {
        const msg = `Cannot transition from "${module.status}" to "${newStatus}"`;
        throw new Error(msg);
      }

      module.status = newStatus;
      await module.save({ session });
      await session.commitTransaction();

      return {
        id: module.id,
        title: module.title,
        displayIndex: module.displayIndex,
        status: module.status as ModuleStatus,
      } as CourseModuleDTO;
    } catch (error) {
      await session.abortTransaction();
      Logger.error(
        `Failed to change status for module ${moduleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
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
      for (let i = 1; i <= numPages; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const newPage = await LessonPageModel.create(
          [
            {
              // Note: Wrapped in array as per Mongoose v7+ requirements
              title: `Page ${i}`,
              displayIndex: courseModule.pages.length + i,
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
        status: updatedModule.status as ModuleStatus,
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
