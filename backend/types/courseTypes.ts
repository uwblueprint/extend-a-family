export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
};

export type CreateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;

export type UpdateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;

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
