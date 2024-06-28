import React, { useState, ReactNode, useRef } from "react";
import Draggable, {
  DraggableEventHandler,
  DraggableData,
} from "react-draggable";

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

interface DraggableSourceProps {
  targetRef: React.RefObject<HTMLElement>;
  dispatch: React.Dispatch<any>;
  onDrag?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
  componentType: string;
  children: ReactNode;
  [key: string]: any;
}

const DraggableSource: React.FC<DraggableSourceProps> = ({
  targetRef,
  dispatch,
  onDrag,
  onStop,
  componentType,
  children,
  ...rest
}) => {
  const [inserted, setInserted] = useState(false);

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

  const onDragOverwrite: DraggableEventHandler = (e, data) => {
    if (onDrag) onDrag(e, data);
    const target = elementIsInChain(
      e.target as HTMLElement,
      targetRef.current!,
    );
    if (!target && inserted) {
      dispatch({ type: "clearTemp" });
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
        dispatch({ type: "addTemp", mouseEvent, content: componentType });
      }
      setInserted(true);
    }
  };

  const onStopOverwrite: DraggableEventHandler = (e, data) => {
    if (onStop) onStop(e, data);
    if (inserted) {
      dispatch({ type: "finaliseTemporaryItem" });
      setInserted(false);
    } else {
      dispatch({ type: "clearTemp" });
    }
  };

  return (
    <div style={{ visibility: inserted ? "hidden" : "visible" }}>
      <Draggable
        onDrag={onDragOverwrite}
        onStop={onStopOverwrite}
        {...rest}
        position={{ x: 0, y: 0 }}
      >
        {children}
      </Draggable>
    </div>
  );
};

export default DraggableSource;
