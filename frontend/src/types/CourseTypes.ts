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

export interface CoursePage {
  id: string;
  title: string;
  type: PageType;
}

export interface LessonPage extends CoursePage {
  source: string;
  pageIndex: number;
}

interface BaseActivity extends CoursePage {
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  questionType: QuestionType.MultipleChoice;
  options: string[];
  correctAnswer: number;
}

export interface MultiSelectActivity extends BaseActivity {
  questionType: QuestionType.MultiSelect;
  options: string[];
  correctAnswers: number[];
}

export type Activity = MultipleChoiceActivity | MultiSelectActivity;

export function isLessonPage(page: CoursePage): page is LessonPage {
  return page.type === "Lesson";
}

export function isActivityPage(page: CoursePage): page is Activity {
  return Object.values(QuestionType).includes(page.type as QuestionType);
}

export function isMultipleChoiceActivity(
  activity: BaseActivity,
): activity is MultipleChoiceActivity {
  return activity.questionType === QuestionType.MultipleChoice;
}

export function isMultiSelectActivity(
  activity: BaseActivity,
): activity is MultiSelectActivity {
  return activity.questionType === QuestionType.MultiSelect;
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
