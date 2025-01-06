import React, { createContext, createRef, useReducer, useRef } from "react";
import { CourseElement } from "../types/CourseTypes";
import layoutReducer, {
  LayoutAction,
  LayoutItem,
} from "../components/course_authoring/activity/grid/layoutReducer";

type ActivityContextType = {
  activeElement: CourseElement | null;
  setActiveElement: (_activeElement: CourseElement | null) => void;
  layout: LayoutItem[];
  dispatchLayout: React.Dispatch<LayoutAction>;
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const ActivityContext = createContext<ActivityContextType>({
  activeElement: null,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setActiveElement: (_activeElement: CourseElement | null): void => {},
  layout: [],
  dispatchLayout: () => {},
  targetRef: createRef(),
});

type ActivityContextProviderProps = {
  children: React.ReactNode;
};

export const ActivityContextProvider = ({
  children,
}: ActivityContextProviderProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [layout, dispatchLayout] = useReducer(layoutReducer, []);
  return (
    <ActivityContext.Provider
      value={{
        activeElement: null,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        setActiveElement: (_activeElement: CourseElement | null): void => {},
        layout,
        dispatchLayout,
        targetRef,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
