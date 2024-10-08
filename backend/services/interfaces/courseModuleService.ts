import {
  CourseModuleDTO,
  CreateCourseModuleDTO,
  UpdateCourseModuleDTO,
} from "../../types/courseTypes";

interface ICourseModuleService {
  /**
   * Returns all course modules belonging to a unit
   * @param courseUnitId the id of the unit we want to fetch the modules of
   * @throwsError if course modules were not successfully fetched
   */
  getCourseModules(courseUnitId: string): Promise<Array<CourseModuleDTO>>;

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
   * Updates 1 specific course module
   * @param courseModuleId the id of the course module we want to update
   * @param courseModuleDTO the info (currently just title) about course module we want to update
   * @throws Error if the course module failed to update
   */
  updateCourseModule(
    courseModuleId: string,
    courseModuleDTO: UpdateCourseModuleDTO,
  ): Promise<CourseModuleDTO>;

  /**
   * Deletes 1 course, reduces display index of all course modules with a display index higher than
   * than the course with this display index
   * @param courseModuleId the id of the course module we want to delete
   * @param courseUniteId the id of the course unit that the course module belongs to
   * @throws Error if the course id does't exist in the database
   */
  deleteCourseModule(
    courseUnitId: string,
    courseModuleId: string,
  ): Promise<string>;
}

export default ICourseModuleService;
