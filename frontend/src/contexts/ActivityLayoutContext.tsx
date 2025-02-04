import React, { createContext, createRef, useReducer, useRef } from "react";
import layoutReducer, {
  LayoutAction,
  LayoutItem,
} from "../components/course_authoring/activity/grid/layoutReducer";

type ActivityLayoutContextType = {
  layout: LayoutItem[];
  dispatchLayout: React.Dispatch<LayoutAction>;
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const ActivityLayoutContext = createContext<ActivityLayoutContextType>({
  layout: [],
  dispatchLayout: () => {},
  targetRef: createRef(),
});

type ActivityLayoutContextProviderProps = {
  children: React.ReactNode;
};

export const ActivityLayoutContextProvider = ({
  children,
}: ActivityLayoutContextProviderProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [layout, dispatchLayout] = useReducer(layoutReducer, []);
  return (
    <ActivityLayoutContext.Provider
      value={{
        layout,
        dispatchLayout,
        targetRef,
      }}
    >
      {children}
    </ActivityLayoutContext.Provider>
  );
};
