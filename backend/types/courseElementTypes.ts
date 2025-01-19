export enum DisplayElementType {
  Text = "Text",
  Image = "Image",
}

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

export type ElementType =
  | DisplayElementType
  | InteractiveElementType
  | HybridElementType;

export interface ElementPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ElementData {
  type: ElementType;
}

// Text element
export type FontSize = "Large" | "Medium" | "Small";
export function isFontSize(fontSize: string): fontSize is FontSize {
  return ["Large", "Medium", "Small"].includes(fontSize);
}

export type FontWeight = "Normal" | "Bold";
export function isFontWeight(fontWeight: string): fontWeight is FontWeight {
  return ["Normal", "Bold"].includes(fontWeight);
}

export type TextAlign = "Left" | "Center" | "Right";
export function isTextAlign(textAlign: string): textAlign is TextAlign {
  return ["Left", "Center", "Right"].includes(textAlign);
}

export interface TextElementData extends ElementData {
  text: string;
  fontSize: FontSize;
  fontWeight: FontWeight;
  textAlign: TextAlign;
}

export function isTextElementData(
  elementData: ElementData,
): elementData is TextElementData {
  return elementData.type === DisplayElementType.Text;
}
