import React, { useContext } from "react";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";
import { isTextElementData } from "../../../../types/CourseElementTypes";
import TextElement from "./TextElement";

interface BaseElementProps {
  id: string;
  elementType: string;
}

const BaseElement: React.FC<BaseElementProps> = ({ id, elementType }) => {
  const { elements } = useContext(ActivityDataContext);

  const elementData = elements.get(id);

  if (!elementData) {
    return <></>;
  }

  // Grid items
  if (elementType === "Text" && isTextElementData(elementData)) {
    return <TextElement id={id} elementData={elementData} />;
  }

  return <></>;
};

export default BaseElement;
