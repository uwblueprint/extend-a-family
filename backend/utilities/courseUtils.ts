import { DisplayElementType, ElementData } from "../types/courseElementTypes";

function validateTextElementData(value: ElementData) {
  return (
    "text" in value &&
    "fontSize" in value &&
    "fontWeight" in value &&
    "textAlign" in value
  );
}

export function validateElementData(value: ElementData) {
  return (
    value.type === DisplayElementType.Text && validateTextElementData(value)
    // TODO - add rest of types
  );
}
