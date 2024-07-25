import React, { useRef, useEffect } from "react";
import BaseModule from "../../course_authoring/BaseModule";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

interface GridElementProps {
  isTemporary?: boolean;
  layoutManifest: { i: string; w: number; h: number };
  componentType?: string;
  initialMouseEvent?: MouseEventLike;
  activeComponentId: string;
  data: Map<string, object>;
  updateData: (data: Map<string, object>) => void;
  setActiveComponentId: (id: string) => void;
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  layout?: any;
}

const triggerDragStartEvent = (
  element: HTMLElement,
  mouseEvent: MouseEventLike,
) => {
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: mouseEvent.clientX,
    clientY: mouseEvent.clientY,
  });

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

  Object.defineProperty(element, "getBoundingClientRect", {
    value: originalGetBoundingClientRect,
  });
};

const GridElement: React.FC<GridElementProps> = ({
  isTemporary,
  layoutManifest,
  activeComponentId,
  setActiveComponentId,
  data,
  updateData,
  initialMouseEvent,
  componentType,
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onTouchStart,
  layout,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (currentElement && isTemporary && initialMouseEvent) {
      triggerDragStartEvent(currentElement, initialMouseEvent);
    }

    return () => {
      if (currentElement && isTemporary && initialMouseEvent) {
        // TODO: Handle drag stop event if needed
      }
    };
  }, [elementRef, isTemporary, initialMouseEvent]);

  return (
    <div
      ref={elementRef}
      style={{ height: "100%", ...style }}
      className={className}
      onMouseDown={(e) => {
        setActiveComponentId(
          activeComponentId === layoutManifest.i ? "10000" : layoutManifest.i,
        );
        if (onMouseDown) onMouseDown(e);
      }}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      <BaseModule
        name={componentType || ""}
        activeComponent={activeComponentId}
        elementLayoutManifest={layoutManifest}
        data={data}
        setData={updateData}
      />
    </div>
  );
};

export default GridElement;
