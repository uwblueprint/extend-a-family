import { CoursePageDTO } from "./courseTypes";

export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  MultiSelect = "MultiSelect",
  Matching = "Matching",
  Table = "Table",
  Custom = "Custom",
}

export interface ActivityDTO extends CoursePageDTO {
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
}

export interface Media {
  id: string;
  mediaType: "text" | "media";
  context: string;
}

export interface MatchingActivityDTO extends ActivityDTO {
  questionType: QuestionType.Matching;
  media: Map<"1" | "2" | "3", Media[]>;
  correctAnswers: string[][];
  rows: number;
}

export interface MultipleChoiceActivityDTO extends ActivityDTO {
  questionType: QuestionType.MultipleChoice;
  options: string[];
  correctAnswer: number;
}

export interface MultiSelectActivityDTO extends ActivityDTO {
  questionType: QuestionType.MultiSelect;
  options: string[];
  correctAnswers: number[];
}

export interface TableActivityDTO extends ActivityDTO {
  questionType: QuestionType.Table;
  columnLabels: string[];
  rowLabels: Map<string, string | undefined>; // key is label, and value is image URL
  correctAnswers: number[][];
}

// Future question types would have their own specific fields
// export interface TextInputActivityDTO extends ActivityDTO {
//   questionType: QuestionType.TextInput;
//   correctAnswer?: string;
//   placeholder?: string;
// }

// export interface TableActivityDTO extends ActivityDTO {
//   questionType: QuestionType.Table;
//   rows: number;
//   columns: number;
//   content: string[][];
// }

export type CreateActivityDTO =
  | Pick<
      MultipleChoiceActivityDTO,
      | "questionType"
      | "activityNumber"
      | "questionText"
      | "instruction"
      | "options"
      | "correctAnswer"
      | "imageUrl"
      | "additionalContext"
      | "userFeedback"
    >
  | Pick<
      MultiSelectActivityDTO,
      | "questionType"
      | "activityNumber"
      | "questionText"
      | "instruction"
      | "options"
      | "correctAnswers"
      | "imageUrl"
      | "additionalContext"
      | "userFeedback"
    >
  | Pick<
      MatchingActivityDTO,
      | "questionType"
      | "activityNumber"
      | "questionText"
      | "instruction"
      | "media"
      | "correctAnswers"
      | "rows"
    >
  | Pick<
      TableActivityDTO,
      | "questionType"
      | "activityNumber"
      | "questionText"
      | "instruction"
      | "columnLabels"
      | "rowLabels"
      | "correctAnswers"
    >;

export type UpdateActivityDTO = CreateActivityDTO;
