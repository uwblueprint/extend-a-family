import React, { createContext, useReducer, useRef, useState } from "react";
import layoutReducer from "../components/course_authoring/activity/grid/layoutReducer";
import { CourseElementData } from "../types/CourseElementTypes";

type ActivityDataContextType = {
  elements: Map<string, CourseElementData>;
  setElements: (_elements: Map<string, CourseElementData>) => void;
  activeElementId: string | null;
  setActiveElementId: (_activeElementId: string | null) => void;
};

export const ActivityDataContext = createContext<ActivityDataContextType>({
  elements: new Map<string, CourseElementData>(),
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setElements: (_elements: Map<string, CourseElementData>): void => {},
  activeElementId: null,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setActiveElementId: (_activeElementId: string | null): void => {},
});

type ActivityDataContextProviderProps = {
  children: React.ReactNode;
};

export const ActivityDataContextProvider = ({
  children,
}: ActivityDataContextProviderProps) => {
  const [elements, setElements] = useState(
    new Map<string, CourseElementData>(),
  );
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [layout, dispatchLayout] = useReducer(layoutReducer, []);
  return (
    <ActivityDataContext.Provider
      value={{
        elements,
        setElements,
        activeElementId,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        setActiveElementId,
      }}
    >
      {children}
    </ActivityDataContext.Provider>
  );
};
