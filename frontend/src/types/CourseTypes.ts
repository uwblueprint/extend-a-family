export type CourseUnit = {
  id: string;
  displayIndex: number;
  title: string;
};

export enum PageType {
  Lesson = "Lesson",
  Activity = "Activity",
}

export interface CoursePage {
  id: string;
  title: string;
  type: PageType;
}

export interface LessonPage extends CoursePage {
  source: string;
  pageIndex: number;
}

export interface ActivityPage extends CoursePage {
  layout: [];
}

export function isLessonPage(page: CoursePage): page is LessonPage {
  return page.type === PageType.Lesson;
}

export function isActivityPage(page: CoursePage): page is ActivityPage {
  return page.type === PageType.Activity;
}

export type CourseModule = {
  id: string;
  displayIndex: number;
  title: string;
  imageURL?: string;
  pages: [CoursePage];
};

export enum InteractiveElementType {
  TextInput = "TextInput",
  NumberInput = "NumberInput",
  CheckboxInput = "CheckboxInput",
  MultipleChoice = "MultipleChoice",
  Matching = "Matching",
}

export enum HybridElementType {
  Table = "Table",
}

export enum DisplayElementType {
  RichText = "RichText",
  Image = "Image",
}

export type ElementType =
  | DisplayElementType
  | InteractiveElementType
  | HybridElementType;

export enum UnitSidebarModalType {
  Create = "Create",
  Delete = "Delete",
  Edit = "Edit",
}
