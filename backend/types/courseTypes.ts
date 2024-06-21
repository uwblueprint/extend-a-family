export type PageType = "Lesson" | "Activity";

export type DisplayElementType = "RichText" | "Image";

export type InteractiveElementType =
  | "TextInput"
  | "NumberInput "
  | "CheckboxInput"
  | "MultipleChoice"
  | "Matching";

export type HybridElementType = "Table";

export type ElementType =
  | DisplayElementType
  | InteractiveElementType
  | HybridElementType;
