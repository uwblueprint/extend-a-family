import {
  CourseUnitDTO,
  CreateCourseUnitDTO,
  UpdateCourseUnitDTO,
} from "../../types/courseTypes";

interface ICourseService {
  getCourses(): Promise<Array<CourseUnitDTO>>;

  createCourse(course: CreateCourseUnitDTO): Promise<CourseUnitDTO>;

  updateCourse(id: string, course: UpdateCourseUnitDTO): Promise<CourseUnitDTO>;

  deleteCourse(id: string): Promise<string>;
}

export default ICourseService;
