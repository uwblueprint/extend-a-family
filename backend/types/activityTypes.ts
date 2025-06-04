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
  options: string[];
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
}

export interface MultipleChoiceActivityDTO extends ActivityDTO {
  questionType: QuestionType.MultipleChoice;
  correctAnswer: number;
}

export interface MultiSelectActivityDTO extends ActivityDTO {
  questionType: QuestionType.MultiSelect;
  correctAnswers: number[];
}

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
