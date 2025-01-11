import React, { useContext } from "react";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";
import { isTextElementData } from "../../../../types/CourseElementTypes";
import TextDataForm from "../data_forms/TextDataForm";
import TextElement from "./TextElement";

interface BaseElementProps {
  name: string;
  id: string;
}

const BaseElement: React.FC<BaseElementProps> = ({ name, id }) => {
  const { elements, activeElementId } = useContext(ActivityDataContext);

  const elementData = elements.get(id);

  if (!elementData) {
    return <></>;
  }

  // Grid items
  if (name === "Text" && isTextElementData(elementData)) {
    return <TextElement id={id} elementData={elementData} />;
  }

  // Corresponding edit panel
  if (name === "TextDataForm")
    return <TextDataForm id={activeElementId ?? ""} />;
  return <></>;
};

export default BaseElement;
