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
  title: string;
  type: PageType;
};

export type LessonPageDTO = CoursePageDTO & {
  source: string;
};

export type ElementSkeleton = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
};
export type ActivityPageDTO = CoursePageDTO & {
  layout: [ElementSkeleton];
};

export type CreateCoursePageDTO =
  | Pick<CoursePageDTO, "title" | "type">
  | Pick<LessonPageDTO, "title" | "type" | "source">
  | Pick<ActivityPageDTO, "title" | "type" | "layout">;
export type UpdateCoursePageDTO =
  | Pick<CoursePageDTO, "title" | "type">
  | Pick<LessonPageDTO, "title" | "type" | "source">
  | Pick<ActivityPageDTO, "title" | "type" | "layout">;

export enum InteractiveElementType {
  TextInput = "TextInput",
  NumberInput = "NumberInput",
  CheckboxInput = "CheckboxInput",
  MultipleChoice = "MultipleChoice",
  Matching = "Matching",
}

export enum HybridElementType {
  Table = "Table",
}

export enum DisplayElementType {
  Text = "Text",
  Image = "Image",
}

export type ElementType =
  | DisplayElementType
  | InteractiveElementType
  | HybridElementType;
