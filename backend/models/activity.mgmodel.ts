import { Document, Schema } from "mongoose";
import { QuestionType } from "../types/activityTypes";
import CoursePageModel, { CoursePage } from "./coursepage.mgmodel";

// Base Activity Interface
export interface Activity extends CoursePage {
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
  hint?: string;
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

export interface Media {
  id: string;
  mediaType: "text" | "media";
  context: string;
}

export interface MatchingActivity extends Activity {
  questionType: QuestionType.Matching;
  media: Map<"1" | "2" | "3", Media[]>; // key: column number
  correctAnswers: string[][]; // [[id2, id2, id3]....] where all strings in one set form a correct match
  rows: number;
}

export interface TableActivity extends Activity {
  questionType: QuestionType.Table;
  columnLabels: string[];
  rowLabels: Map<string, string | undefined>; // key: label, value: image url
  correctAnswers: number[][]; // list of table coordinates which represent answers [row, col]
}

export type TextInputValidation =
  | {
      mode: "short_answer";
      answers: string[];
    }
  | {
      mode: "numeric_set";
      values: number[];
    }
  | {
      mode: "numeric_range";
      min?: number;
      max?: number;
    };

export interface TextInputActivity extends Activity {
  questionType: QuestionType.TextInput;
  placeholder?: string;
  maxLength?: number;
  validation?: TextInputValidation;
}

const options2 = {
  discriminatorKey: "role",
  timestamps: true,
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: Document, ret: Record<string, unknown>) => {
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      delete ret._id;
      // eslint-disable-next-line no-param-reassign
      delete ret.createdAt;
      // eslint-disable-next-line no-param-reassign
      delete ret.updatedAt;
    },
  },
};

export const ActivitySchema: Schema = new Schema(
  {
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
    hint: {
      type: String,
      required: false,
    },
  },
  options2,
);

// Create combined schemas for each specific activity type

const MediaSchema = new Schema({
  id: { type: String, required: true },
  mediaType: { type: String, enum: ["text", "media"], required: true },
  context: { type: String, required: true },
});

const MatchingActivitySchema = new Schema({
  ...ActivitySchema.obj,
  media: {
    type: Map,
    of: [MediaSchema],
    required: true,
    validate: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (mediaMap: Map<string, any[]>) => {
        const keys = Array.from(mediaMap.keys());
        return keys.every((k) => ["1", "2", "3"].includes(k));
      },
      message: "Media map keys must be the strings '1', '2', or '3'",
    },
  },
  correctAnswers: {
    type: [[String]],
    required: true,
    set: (val: string[][]) => val.map((arr) => Array.from(new Set(arr))), // ensures uniqueness
    validate: {
      validator: (value: string[][]) =>
        value.every((arr) => arr.length === 3 || arr.length === 2),
      message: "Each answer set must have exactly 2 or 3 unique elements",
    },
  },
  rows: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => {
        return value >= 2 && value <= 6;
      },
      message: "Must have between 2 and 6 rows",
    },
  },
});

// Base model
// const ActivityModel =
//   mongoose.models.Activity ||
//   mongoose.model<Activity>("Activity", ActivitySchema);

// Multiple choice specific schema
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
    // validate: {
    //   validator(this: MultipleChoiceActivity, correctAnswer: number) {
    //     console.log(
    //       "Validating correctAnswer:",
    //       correctAnswer,
    //       JSON.stringify(this.options),
    //     );
    //     return correctAnswer >= 0 && correctAnswer < this.options.length;
    //   },
    //   message: "Correct answer must be a valid option index",
    // },
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
          return answer >= 0; // && answer < this.options.length;
        });
      },
      message: "Must have at least one valid correct answer",
    },
  },
});

const TableActivitySchema = new Schema({
  ...ActivitySchema.obj,
  columnLabels: {
    type: [String],
    required: true,
  },
  rowLabels: {
    type: Map,
    of: {
      type: String,
      required: false,
    },
    required: true,
  },
  correctAnswers: {
    type: [[Number]],
    required: true,
    validate: {
      validator: (value: number[][]) =>
        value.every((pair) => pair.length === 2),
      message: "Each coordinate must be a pair of numbers [row, col]",
    },
  },
});

const TextInputActivitySchema = new Schema({
  ...ActivitySchema.obj,
  placeholder: {
    type: String,
    required: false,
  },
  maxLength: {
    type: Number,
    required: false,
    validate: {
      validator: (v: number) => v > 0,
      message: "maxLength must be a positive number",
    },
  },
  validation: {
    type: {
      mode: {
        type: String,
        required: true,
        enum: ["short_answer", "numeric_set", "numeric_range"],
      },
      // short_answer
      answers: { type: [String], required: false },
      // numeric_set
      values: { type: [Number], required: false },
      // numeric_range
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    required: true,
  },
});

const MatchingActivityModel = CoursePageModel.discriminator<MatchingActivity>(
  QuestionType.Matching,
  MatchingActivitySchema,
);

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

const TableActivityModel = CoursePageModel.discriminator<TableActivity>(
  QuestionType.Table,
  TableActivitySchema,
);

const TextInputActivityModel = CoursePageModel.discriminator<TextInputActivity>(
  QuestionType.TextInput,
  TextInputActivitySchema,
);

export {
  MatchingActivityModel,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
  TextInputActivityModel,
};
