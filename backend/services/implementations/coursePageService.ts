/* eslint-disable class-methods-use-this */
import {
    CourseUnitDTO,
    CreateCourseUnitDTO,
    UpdateCourseUnitDTO,
  } from "../../types/courseTypes";
  import logger from "../../utilities/logger";
  import ICourseUnitService from "../interfaces/courseUnitService";
  import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
  import MgCoursePage
  import { getErrorMessage } from "../../utilities/errorUtils";
  import { CoursePage } from "../../models/coursepage.mgmodel";
  
  const Logger = logger(__filename);
  
  class CoursePageService implements ICourseUnitService {
    async getCoursePages(): Promise<Array<CourseModuleDTO>> {
      try {
        const coursePages: Array<CoursePage> = await MgCoursePage.find().sort(
          "displayIndex",
        )
        return CourseUnitService.map((coursePages) => ({
          id: coursePages.id;
          displayIndex: coursePages
        }))
      } catch (error) {
  
      }
    }
  }
  
  export default CourseUnitService;
  