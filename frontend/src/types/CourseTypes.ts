import { ElementData, ElementPosition } from "./CourseElementTypes";

export type CourseUnit = {
  id: string;
  displayIndex: number;
  title: string;
};

export type PageType = "Lesson" | "Activity";

export type CoursePage = {
  id: string;
  type: PageType;
};

export type LessonPage = CoursePage & {
  source: string;
};

export function isLessonPage(page: CoursePage): page is LessonPage {
  return page.type === "Lesson";
}

export interface Element extends ElementPosition {
  data: ElementData | undefined;
}

export type ActivityPage = CoursePage & {
  elements: Element[];
};

export function isActivityPage(page: CoursePage): page is ActivityPage {
  return page.type === "Activity";
}
