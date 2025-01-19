import React, { useState, ReactNode, useContext } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { Box } from "@mui/material";
import { ActivityLayoutContext } from "../../../../contexts/ActivityLayoutContext";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";
import { defaultTextElement } from "../elements/defaultElements";

const elementIsInChain = (
  elementToTraverse: HTMLElement | null,
  elementToFind: HTMLElement,
): HTMLElement | false => {
  if (elementToTraverse === elementToFind) {
    return elementToFind;
  }
  if (elementToTraverse?.parentElement) {
    return elementIsInChain(elementToTraverse.parentElement, elementToFind);
  }
  return false;
};

const getMouseEvent = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    return { clientX: e.clientX, clientY: e.clientY };
  }
  if (e instanceof TouchEvent && e.touches.length > 0) {
    const touch = e.touches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return null;
};

interface DraggableSourceProps {
  onDrag?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
  elementType: string;
  children: ReactNode;
}

const DraggableSource: React.FC<DraggableSourceProps> = ({
  onDrag,
  onStop,
  elementType,
  children,
}) => {
  const { targetRef, layout, dispatchLayout } = useContext(
    ActivityLayoutContext,
  );
  const { elements, setElements, setActiveElementId } =
    useContext(ActivityDataContext);
  const [inserted, setInserted] = useState(false);

  const onDragOverwrite: DraggableEventHandler = (e, data) => {
    if (onDrag) onDrag(e, data);
    const target = elementIsInChain(
      e.target as HTMLElement,
      targetRef.current!,
    );
    if (!target && inserted) {
      dispatchLayout({ type: "clearTemp" });
      setInserted(false);
      const placeHolder = document.querySelector(
        ".react-grid-placeholder",
      ) as HTMLElement;
      if (placeHolder) placeHolder.style.transform = "translate(-8000px, 0px)";
      return;
    }
    if (target && !inserted) {
      const mouseEvent = getMouseEvent(e as MouseEvent | TouchEvent);
      if (mouseEvent) {
        dispatchLayout({ type: "addTemp", mouseEvent, elementType });
      }
      setInserted(true);
    }
  };

  const onStopOverwrite: DraggableEventHandler = (e, data) => {
    if (onStop) onStop(e, data);
    if (inserted) {
      dispatchLayout({ type: "finaliseTemporaryItem" });
      setInserted(false);
      // Add new element to elements data object
      const newLayoutItem = layout[layout.length - 1];
      const updatedElements = new Map(elements);
      const newId = newLayoutItem.i;
      updatedElements.set(newId, defaultTextElement);
      setElements(updatedElements);
      setActiveElementId(newId);
    } else {
      dispatchLayout({ type: "clearTemp" });
    }
  };

  return (
    <Box
      visibility={inserted ? "hidden" : "visible"}
      sx={{ "&:hover": { cursor: "pointer" } }}
    >
      <Draggable
        onDrag={onDragOverwrite}
        onStop={onStopOverwrite}
        position={{ x: 0, y: 0 }}
        grid={[18, 32]}
      >
        {children}
      </Draggable>
    </Box>
  );
};

export default DraggableSource;
