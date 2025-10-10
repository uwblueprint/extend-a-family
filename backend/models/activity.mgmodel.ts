import { Document, Schema } from "mongoose";
import { QuestionType } from "../types/courseTypes";
import CoursePageModel, { CoursePageBase } from "./coursepage.mgmodel";

// Base Activity Interface
export interface Activity extends CoursePageBase {
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
}

export interface MultipleChoiceActivity extends Activity {
  questionType: QuestionType.MultipleChoice;
  options: string[];
  correctAnswer: number;
}

export interface MultiSelectActivity extends Activity {
  questionType: QuestionType.MultiSelect;
  options: string[];
  correctAnswers: number[];
}

export const ActivitySchema: Schema = new Schema({
  questionType: {
    type: String,
    required: true,
    enum: Object.values(QuestionType),
  },
  activityNumber: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  instruction: {
    type: String,
    required: true,
    maxlength: 200,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  additionalContext: {
    type: String,
    required: false,
    maxlength: 500,
  },
  userFeedback: {
    type: String,
    required: false,
    maxlength: 500,
  },
});

/* eslint-disable no-param-reassign */
ActivitySchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

// Create combined schemas for each specific activity type
const MultipleChoiceActivitySchema = new Schema({
  ...ActivitySchema.obj, // inherit base fields from ActivitySchema
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options: string[]) => {
        return options.length >= 2 && options.length <= 6;
      },
      message: "Must have between 2 and 6 options",
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator(this: MultipleChoiceActivity, correctAnswer: number) {
        return correctAnswer >= 0 && correctAnswer < this.options.length;
      },
      message: "Correct answer must be a valid option index",
    },
  },
});

const MultiSelectActivitySchema = new Schema({
  ...ActivitySchema.obj, // inherit base fields from ActivitySchema
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options: string[]) => {
        return options.length >= 2 && options.length <= 6;
      },
      message: "Must have between 2 and 6 options",
    },
  },
  correctAnswers: {
    type: [Number],
    required: true,
    validate: {
      validator(this: MultiSelectActivity, correctAnswers: number[]) {
        if (correctAnswers.length === 0) {
          return false;
        }
        return correctAnswers.every((answer) => {
          return answer >= 0 && answer < this.options.length;
        });
      },
      message: "Must have at least one valid correct answer",
    },
  },
});

MultipleChoiceActivitySchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

MultiSelectActivitySchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

const MultipleChoiceActivityModel =
  CoursePageModel.discriminator<MultipleChoiceActivity>(
    QuestionType.MultipleChoice,
    MultipleChoiceActivitySchema,
  );

const MultiSelectActivityModel =
  CoursePageModel.discriminator<MultiSelectActivity>(
    QuestionType.MultiSelect,
    MultiSelectActivitySchema,
  );

export { MultipleChoiceActivityModel, MultiSelectActivityModel };
