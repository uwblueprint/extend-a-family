import { PageType } from "../models/coursepage.mgmodel";

export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
};

export type CoursePageDTO = {
  id: string;
  displayIndex: number;
  title: string;
  layout: [Element ]
}

export type CreateCourseUnitDTO = Pick<CourseUnitDTO, "title">;

export type UpdateCourseUnitDTO = Pick<CourseUnitDTO, "title">;

export type CourseModuleDTO = {
  id: string;
  title: string;
  displayIndex: number;
  type: PageType;
};

export type CreateCourseModuleDTO = Pick<CourseModuleDTO, "title">;
export type UpdateCourseModuleDTO = Pick<CourseModuleDTO, "title">;

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
  RichText = "RichText",
  Image = "Image",
}

export type ElementType =
  | DisplayElementType
  | InteractiveElementType
  | HybridElementType;
