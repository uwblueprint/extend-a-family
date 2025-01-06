import { createContext } from "react";
import { CoursePage } from "../types/CourseTypes";

type CourseAuthoringContextType = {
  activePage: CoursePage | null;
  setActivePage: (_activePage: CoursePage | null) => void;
};

const CourseAuthoringContext = createContext<CourseAuthoringContextType>({
  activePage: null,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setActivePage: (_activePage: CoursePage | null): void => {},
});

export default CourseAuthoringContext;
