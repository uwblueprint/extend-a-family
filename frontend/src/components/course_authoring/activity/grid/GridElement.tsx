import React, { useRef, useEffect } from "react";
import BaseElement from "../elements/BaseElement";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

interface GridElementProps {
  temp?: boolean;
  id: string;
  elementType?: string;
  mouseEvent?: MouseEventLike;
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
}

const createDragStartEvent = (
  element: HTMLElement,
  mouseEvent: MouseEventLike,
) => {
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: mouseEvent.clientX,
    clientY: mouseEvent.clientY,
  });

  // Fake getBoundingClientRect for one call
  // This way, we can influence where the drag action is started
  const originalGetBoundingClientRect =
    element.getBoundingClientRect.bind(element);
  const modifiedGetBoundingClientRect = () => ({
    ...originalGetBoundingClientRect(),
    left: mouseEvent.clientX,
    top: mouseEvent.clientY,
  });

  Object.defineProperty(element, "getBoundingClientRect", {
    value: modifiedGetBoundingClientRect,
    configurable: true,
  });

  element.dispatchEvent(event);

  // Restore original getBoundingClientRect
  Object.defineProperty(element, "getBoundingClientRect", {
    value: originalGetBoundingClientRect,
  });
};

const GridElement: React.FC<GridElementProps> = ({
  temp,
  id,
  mouseEvent,
  elementType,
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onTouchStart,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Fake the drag start event if it's a new element with property temp
  useEffect(() => {
    const refCur = ref.current;
    if (refCur && temp && mouseEvent) {
      createDragStartEvent(refCur, mouseEvent);
    }

    return () => {
      if (refCur && temp && mouseEvent) {
        // TODO: Cannot initiate drag stop event because drag start event is not recognized
        // createDragStopEvent(refCur);
      }
    };
  }, [ref, temp, mouseEvent]);

  return (
    <div
      ref={ref}
      style={{ height: "100%", ...style }}
      className={className}
      onMouseDown={(e) => {
        if (onMouseDown) onMouseDown(e);
      }}
      onMouseUp={(e) => {
        if (onMouseUp) onMouseUp(e);
      }}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      <BaseElement id={id} elementType={elementType ?? ""} />
    </div>
  );
};

GridElement.defaultProps = {
  mouseEvent: { clientX: 0, clientY: 0 },
};

export default GridElement;
