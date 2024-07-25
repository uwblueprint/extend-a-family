import {
  CourseUnitDTO,
  CreateCourseUnitDTO,
  UpdateCourseUnitDTO,
} from "../../types/courseTypes";

interface ICourseService {
  /**
   * Returns all courseunits
   * @throwsError if courses were not successfully fetched
   */
  getCourseUnits(): Promise<Array<CourseUnitDTO>>;

  /**
   * Creates a course unit
   * @param course the info (currently just title) about course we want to create
   * @throws Error if course was not successfully created
   */
  createCourseUnit(courseUnit: CreateCourseUnitDTO): Promise<CourseUnitDTO>;

  /**
   * Updates 1 specific course unit
   * @param id the id of the course we want to fetch
   * @param course the info (currently just title) about course we want to update
   * @throws Error if the course id doesn't exist in the database
   */
  updateCourseUnit(
    id: string,
    courseUnit: UpdateCourseUnitDTO,
  ): Promise<CourseUnitDTO>;

  /**
   * Deletes 1 course, reduces display index of all courses with a display index higher than
   * than the course with this display index
   * @param id the id of the course we want to delete
   * @throws Error if the course id does't exist in the database
   */
  deleteCourseUnit(id: string): Promise<string>;
}

export default ICourseService;
