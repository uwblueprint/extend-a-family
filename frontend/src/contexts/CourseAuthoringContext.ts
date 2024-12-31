import { createContext } from "react";
import { CoursePage, CourseElement } from "../types/CourseTypes";

type CourseAuthoringContextType = {
  activePage: CoursePage | null;
  setActivePage: (_activePage: CoursePage | null) => void;
  activeElement: CourseElement | null;
  setActiveElement: (_activeElement: CourseElement | null) => void;
};

const CourseAuthoringContext = createContext<CourseAuthoringContextType>({
  activePage: null,
  setActivePage: (
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    _activePage: CoursePage | null,
  ): void => {},
  activeElement: null,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  setActiveElement: (_activeElement: CourseElement | null): void => {},
});

export default CourseAuthoringContext;
