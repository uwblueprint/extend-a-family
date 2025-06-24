import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { QuestionType } from "../types/activityTypes";

// Base Activity Interface
export interface Activity extends Document {
  id: ObjectId;
  questionType: QuestionType;
  activityNumber: string;
  questionText: string;
  instruction: string;
  imageUrl?: string;
  additionalContext?: string;
  userFeedback?: string;
}

// Specific question type interfaces
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

export interface MatchingActivity extends Activity {
  questionType: QuestionType.Matching;
  matches: Map<string, string>;
}

export interface TableActivity extends Activity {
  questionType: QuestionType.Table;
  columnLabels: string[];
  rowlabels: string[];
  rowImageUrls: string[];
  correctAnswers: Set<[number, number]>; //representing table coords
}

export interface TextInputActivity extends Activity {
  questionType: QuestionType.Custom;
}

// Base schema with common fields
const baseOptions = {
  discriminatorKey: "questionType",
  timestamps: true,
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
      // Could add validation for format like "4.1"
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
  },
  baseOptions,
);

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

// Base model
const ActivityModel = mongoose.model<Activity>("Activity", ActivitySchema);

// Multiple choice specific schema
const MultipleChoiceActivitySchema = new Schema({
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

// Multi-select specific schema
const MultiSelectActivitySchema = new Schema({
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

const MatchingActivitySchema = new Schema({
  matches: {
    type: {String: String},
    required: true,
    validate: {
      validator: (options: string[]) => {
        return options.length >= 2 && options.length <= 6;
      },
      message: "Must have between 2 and 6 sets of matches",
    },
  },
});

const TableActivitySchema = new Schema({
  columnLabels: {
    type: [String],
    required: true,
  },
  rowLabels: {
    type: [String],
    required: true,
  },
  rowImageUrls: {
    type: [String],
    required: false,
  },
  correctAnswers: {
    type: ([Number, Number]),
    required: true,
  }
});


// Discriminator models
const MultipleChoiceActivityModel =
  ActivityModel.discriminator<MultipleChoiceActivity>(
    QuestionType.MultipleChoice,
    MultipleChoiceActivitySchema,
  );

const MultiSelectActivityModel =
  ActivityModel.discriminator<MultiSelectActivity>(
    QuestionType.MultiSelect,
    MultiSelectActivitySchema,
  );

export { MultipleChoiceActivityModel, MultiSelectActivityModel };
export default ActivityModel;
