import React, { useRef, useEffect } from "react";
import BaseModule from "../modules/BaseModule";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

interface GridElementProps {
  temp?: boolean;
  index: string;
  componentType?: string;
  mouseEvent?: MouseEventLike;
  activeComponent: string;
  data: Map<string, object>;
  setData: (data: Map<string, object>) => void;
  setActiveComponent: (index: string) => void;
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

// const createDragStopEvent = (element: HTMLElement) => {
//   const event = new MouseEvent("mouseup", {
//     bubbles: true,
//     cancelable: true,
//   });
//   element.dispatchEvent(event);
// };

const GridElement: React.FC<GridElementProps> = ({
  temp,
  index,
  activeComponent,
  setActiveComponent,
  data,
  setData,
  mouseEvent,
  componentType,
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
      onMouseDown={() =>
        setActiveComponent(activeComponent === index ? "10000" : index)
      }
      style={{ height: "100%" }}
    >
      <BaseModule
        name={componentType || ""}
        activeComponent={activeComponent}
        index={index}
        data={data}
        setData={setData}
      />
    </div>
  );
};

// Set default props
GridElement.defaultProps = {
  mouseEvent: { clientX: 0, clientY: 0 },
};

export default GridElement;
