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
