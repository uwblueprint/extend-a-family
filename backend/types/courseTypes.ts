import { ElementData } from "./courseElementTypes";

export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
  modules: string[];
};

export type CreateCourseUnitDTO = Pick<CourseUnitDTO, "title">;
export type UpdateCourseUnitDTO = Pick<CourseUnitDTO, "title">;

export type CourseModuleDTO = {
  id: string;
  displayIndex: number;
  title: string;
  pages: string[];
};

export type CreateCourseModuleDTO = Pick<CourseModuleDTO, "title">;
export type UpdateCourseModuleDTO = Pick<CourseModuleDTO, "title">;

export type PageType = "Lesson" | "Activity";

export type CoursePageDTO = {
  id: string;
  type: PageType;
};

export type LessonPageDTO = CoursePageDTO & {
  source: string;
};

export type Element = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  data: ElementData;
};
export type ActivityPageDTO = CoursePageDTO & {
  elements: Element[];
};

export type CreateCoursePageDTO =
  | Pick<CoursePageDTO, "type">
  | Pick<LessonPageDTO, "type" | "source">
  | Pick<ActivityPageDTO, "type" | "elements">;
export type UpdateCoursePageDTO =
  | Pick<CoursePageDTO, "type">
  | Pick<LessonPageDTO, "type" | "source">
  | Pick<ActivityPageDTO, "type" | "elements">;
