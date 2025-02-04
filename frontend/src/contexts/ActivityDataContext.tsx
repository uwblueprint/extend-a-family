import React, { createContext, useState } from "react";
import { ElementData } from "../types/CourseElementTypes";

type ActivityDataContextType = {
  elements: Map<string, ElementData>;
  setElements: (_elements: Map<string, ElementData>) => void;
  activeElementId: string | null;
  setActiveElementId: (_activeElementId: string | null) => void;
};

export const ActivityDataContext = createContext<ActivityDataContextType>({
  elements: new Map<string, ElementData>(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setElements: (_elements: Map<string, ElementData>): void => {},
  activeElementId: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActiveElementId: (_activeElementId: string | null): void => {},
});

type ActivityDataContextProviderProps = {
  children: React.ReactNode;
};

export const ActivityDataContextProvider = ({
  children,
}: ActivityDataContextProviderProps) => {
  const [elements, setElements] = useState(new Map<string, ElementData>());
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  return (
    <ActivityDataContext.Provider
      value={{
        elements,
        setElements,
        activeElementId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setActiveElementId,
      }}
    >
      {children}
    </ActivityDataContext.Provider>
  );
};
