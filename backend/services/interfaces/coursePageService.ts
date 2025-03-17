import {
  CoursePageDTO,
  CreateCoursePageDTO,
  UpdateCoursePageDTO,
} from "../../types/courseTypes";

interface ICoursePageService {
  /**
   * Returns all course pages belonging to a module
   * @param courseModuleId the id of the module we want to fetch the pages of
   * @throws Error if course pages were not successfully fetched
   */
  getCoursePages(courseModuleId: string): Promise<Array<CoursePageDTO>>;

  /**
   * Returns 1 course page
   * @param coursePageId the id of the page we want to fetch
   * @throwsError if course page was not successfully fetched or not found
   */
  getCoursePage(coursePageId: string, lean?: boolean): Promise<CoursePageDTO>;

  /**
   * Creates a course page, appended as the last page in the module (for now)
   * @param courseModuleId the id of the module that we want to create the new page under
   * @param coursePageDTO the info about the course page that we want to create
   * @throws Error if course page was not successfully created
   */
  createCoursePage(
    courseModuleId: string,
    coursePageDTO: CreateCoursePageDTO,
  ): Promise<CoursePageDTO>;

  /**
   * Updates 1 specific course page
   * @param coursePageId the id of the course page we want to update
   * @param coursePageDTO the info about course page we want to update
   * @throws Error if the course page failed to update
   */
  updateCoursePage(
    coursePageId: string,
    coursePageDTO: UpdateCoursePageDTO,
  ): Promise<CoursePageDTO>;

  /**
   * Deletes 1 course page
   * @param coursePageId the id of the course page we want to delete
   * @throws Error if the page id does't exist in the database
   */
  deleteCoursePage(coursePageId: string): Promise<string>;
}

export default ICoursePageService;
