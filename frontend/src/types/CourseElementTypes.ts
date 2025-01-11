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

export interface CourseElementData {
  type: ElementType;
}

export interface TextElementData extends CourseElementData {
  text: string;
  fontWeight: "Normal" | "Bold";
  fontSize: "Large" | "Medium" | "Small";
}

export function isTextElementData(
  elementData: CourseElementData,
): elementData is TextElementData {
  return elementData.type === DisplayElementType.Text;
}
