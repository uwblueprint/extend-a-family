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
  mediaType: "text" | "image";
  context: string; // firebase url if mediaType is image
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
  rowLabels: string[][]; // Each inner array: [labelText, optionalImageUrl]
  correctAnswers: number[][]; // list of table coordinates which represent answers [row, col]
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
  mediaType: { type: String, enum: ["text", "image"], required: true },
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
    // Represented as array of arrays: [labelText, imageUrl?]
    type: [[String]],
    required: true,
    validate: {
      validator: (rows: string[][]) =>
        rows.every((row) => row.length >= 1 && row.length <= 2),
      message:
        "Each row label must have 1 (text) or 2 (text + imageUrl) elements",
    },
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

export {
  MatchingActivityModel,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
};
