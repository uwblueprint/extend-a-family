export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
};

export type CreateCourseUnitDTO = Pick<CourseUnitDTO, "title">;

export type UpdateCourseUnitDTO = Pick<CourseUnitDTO, "title">;

export type CourseModuleDTO = {
  id: string;
  displayIndex: number;
  title: string;
  imageURL?: string;
  expirationDate?: Date;
};

export type CreateCourseModuleDTO = Pick<CourseModuleDTO, "title">;
export type UpdateCourseModuleDTO = Pick<CourseModuleDTO, "title" | "imageURL" | "expirationDate">;

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
