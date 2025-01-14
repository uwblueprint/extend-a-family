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

export type FontWeight = "Normal" | "Bold";
export function isFontWeight(fontWeight: string): fontWeight is FontWeight {
  return ["Normal", "Bold"].includes(fontWeight);
}

export type FontSize = "Large" | "Medium" | "Small";
export function isFontSize(fontSize: string): fontSize is FontSize {
  return ["Large", "Medium", "Small"].includes(fontSize);
}

export type TextAlign = "Left" | "Center" | "Right";
export function isTextAlign(textAlign: string): textAlign is TextAlign {
  return ["Left", "Center", "Right"].includes(textAlign);
}

export interface TextElementData extends CourseElementData {
  text: string;
  fontSize: FontSize;
  fontWeight: FontWeight;
  textAlign: TextAlign;
}

export function isTextElementData(
  elementData: CourseElementData,
): elementData is TextElementData {
  return elementData.type === DisplayElementType.Text;
}
