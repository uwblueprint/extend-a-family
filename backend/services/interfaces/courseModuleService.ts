import { ClientSession } from "mongoose";
import {
  CourseModuleDTO,
  CreateCourseModuleDTO,
  UpdateCourseModuleDTO,
} from "../../types/courseTypes";

interface ICourseModuleService {
  /**
   * Returns all course modules belonging to a unit
   * @param courseUnitId the id of the unit we want to fetch the modules of
   * @throws Error if course modules were not successfully fetched
   */
  getCourseModules(courseUnitId: string): Promise<Array<CourseModuleDTO>>;

  /**
   * Returns the course module specified by the module ID
   * @param courseModuleId the id of the course module we want to fetch
   * @throws Error if course module was not successfully fetched
   */
  getCourseModule(courseModuleId: string): Promise<CourseModuleDTO>;

  /**
   * Creates a course module
   * @param courseUnitId the id of the unit that we want to create the new module under
   * @param courseModuleDTO the info (currently just title) about the course module that we want to create
   * @throws Error if course module was not successfully created
   */
  createCourseModule(
    courseUnitId: string,
    courseModuleDTO: CreateCourseModuleDTO,
  ): Promise<CourseModuleDTO>;

  /**
   * Updates one specific course module
   * @param courseModuleId the id of the course module we want to update
   * @param courseModuleDTO the info (currently just title) about the course module we want to update
   * @throws Error if the course module failed to update
   */
  updateCourseModule(
    courseModuleId: string,
    courseModuleDTO: UpdateCourseModuleDTO,
  ): Promise<CourseModuleDTO>;

  /**
   * Deletes 1 course, reduces display index of all course modules with a display index higher than
   * than the course with this display index
   * @param courseUnitId the id of the course unit that the course module belongs to
   * @param courseModuleId the id of the course module we want to delete
   * @param currSession (optional) current parent MongoDB session
   * @throws Error if the course id does't exist in the database
   */
  deleteCourseModule(
    courseUnitId: string,
    courseModuleId: string,
    currSession?: ClientSession,
  ): Promise<string>;

  /**
   * Uploads a PDF file and creates lesson pages for each page in the PDF
   * @param moduleId the id of the module to add the lessons to
   * @param pdfPath the path to the temporary uploaded PDF file
   * @returns Updated course module
   * @throws Error if upload fails or module not found
   */
  uploadLessons(moduleId: string, pdfPath: string): Promise<CourseModuleDTO>;

  /**
   * Publish a module (Draft → Published, or Unpublished → Published)
   * @param courseUnitId the id of the unit that contains the module
   * @param moduleId the id of the module to publish
   * @throws Error if the status transition is invalid or module/unit not found
   */
  publishCourseModule(
    courseUnitId: string,
    moduleId: string,
  ): Promise<CourseModuleDTO>;

  /**
   * Unpublish a module (Published → Unpublished)
   * @param courseUnitId the id of the unit that contains the module
   * @param moduleId the id of the module to unpublish
   * @throws Error if the status transition is invalid or module/unit not found
   */
  unpublishCourseModule(
    courseUnitId: string,
    moduleId: string,
  ): Promise<CourseModuleDTO>;
}

export default ICourseModuleService;
