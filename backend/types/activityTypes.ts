export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  MultiSelect = "MultiSelect",
  Matching = "Matching",
  Table = "Table",
  Custom = "Custom",
}

export interface ActivityDTO {
  id: string;
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
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
    >;

export type UpdateActivityDTO = CreateActivityDTO;
