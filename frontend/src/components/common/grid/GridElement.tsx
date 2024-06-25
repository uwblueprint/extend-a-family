import React, { useRef, useEffect, ReactNode } from "react";
import { pick } from "lodash";
import BaseModule from "../modules/BaseModule";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

interface GridElementProps {
  temp?: boolean;
  children: ReactNode;
  index: string;
  componentType?: string;
  mouseEvent?: MouseEventLike;
  style?: React.CSSProperties;
  className?: string;
  activeComponent: string;
  data: {};
  setData: (data: Map<string, object>) => void;
  setActiveComponent: (index: string) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  [key: string]: any;
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
  const original = element.getBoundingClientRect;
  element.getBoundingClientRect = () => {
    element.getBoundingClientRect = original;
    return {
      ...original(),
      left: mouseEvent.clientX,
      top: mouseEvent.clientY,
    };
  };
  element.dispatchEvent(event);
};

const createDragStopEvent = (element: HTMLElement) => {
  const event = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};

const GridElement: React.FC<GridElementProps> = ({
  temp,
  children,
  index,
  activeComponent,
  setActiveComponent,
  data,
  setData,
  mouseEvent,
  componentType,
  ...rest
}) => {
  const forwardProps = pick(rest, [
    "style",
    "className",
    "onMouseDown",
    "onMouseUp",
    "onTouchEnd",
    "onTouchStart",
  ]);

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
      {...forwardProps}
      style={{ height: "100%" }}
    >
      <BaseModule
        name={componentType || ""}
        activeComponent={activeComponent}
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
