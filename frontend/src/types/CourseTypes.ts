export type CourseUnit = {
  id: string;
  displayIndex: number;
  title: string;
};

export type PageType = "Lesson" | "Activity";

export type CoursePage = {
  id: string;
  type: PageType;
};

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

export type CourseElement = {
  type: ElementType;
};
