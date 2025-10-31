export type CourseUnit = {
  id: string;
  displayIndex: number;
  title: string;
};

export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  MultiSelect = "MultiSelect",
  Table = "Table",
  Matching = "Matching",
  Custom = "Custom",
}

export type PageType = "Lesson" | QuestionType;

export interface CoursePageBase {
  id: string;
  title: string;
  type: PageType;
}

export interface LessonPage extends CoursePageBase {
  type: "Lesson";
  source: string;
  pageIndex: number;
}

export interface Media {
  id: string;
  mediaType: "text" | "media";
  context: string;
}

interface ActivityBase extends CoursePageBase {
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
  hint?: string;
}

export interface MultipleChoiceActivity extends ActivityBase {
  type: QuestionType.MultipleChoice;
  questionType: QuestionType.MultipleChoice;
  options: string[];
  correctAnswer: number;
}

export interface MultiSelectActivity extends ActivityBase {
  type: QuestionType.MultiSelect;
  questionType: QuestionType.MultiSelect;
  options: string[];
  correctAnswers: number[];
}

export interface MatchingActivity extends ActivityBase {
  questionType: QuestionType.Matching;
  media: Map<"1" | "2" | "3", Media[]>; // key: column number
  correctAnswers: string[][]; // [[id2, id2, id3]....] where all strings in one set form a correct match
  rows: number;
}

export interface TableActivity extends ActivityBase {
  questionType: QuestionType.Table;
  columnLabels: string[];
  rowLabels: Map<string, string | undefined>; // key: label, value: image url
  correctAnswers: number[][]; // list of table coordinates which represent answers [row, col]
}

export type Activity =
  | MultipleChoiceActivity
  | MultiSelectActivity
  | MatchingActivity
  | TableActivity;

export type CoursePage = LessonPage | Activity;

export function isLessonPage(page: CoursePageBase): page is LessonPage {
  return page.type === "Lesson";
}

export function isActivityPage(page: CoursePageBase): page is Activity {
  return Object.values(QuestionType).includes(page.type as QuestionType);
}

export function isMultipleChoiceActivity(
  activity: CoursePage,
): activity is MultipleChoiceActivity {
  return activity.type === QuestionType.MultipleChoice;
}

export function isMultiSelectActivity(
  activity: CoursePage,
): activity is MultiSelectActivity {
  return activity.type === QuestionType.MultiSelect;
}

export function isMatchingActivity(
  activity: CoursePage,
): activity is MatchingActivity {
  return activity.type === QuestionType.Matching;
}

export function isTableActivity(
  activity: CoursePage,
): activity is TableActivity {
  return activity.type === QuestionType.Table;
}

export type CourseModule = {
  id: string;
  displayIndex: number;
  title: string;
  imageURL?: string;
  pages: CoursePage[];
  unitId?: string;
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
