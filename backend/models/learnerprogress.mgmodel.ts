import mongoose, { Document, Schema, ObjectId } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";

/**
 * LearnerProgress tracks a learner's progress through the course.
 *
 * Design decisions:
 * - Stored separately from User model to keep concerns separated and avoid bloating user documents
 * - completedActivities is stored as an array but should be treated as a Set (no duplicates)
 * - moduleCompletions stores the date when a module was completed (all activities in published module done)
 * - lastViewedPage tracks the most recently viewed page for "continue where you left off" functionality
 */

export interface LastViewedPage {
  moduleId: mongoose.Types.ObjectId;
  pageId: mongoose.Types.ObjectId;
  viewedAt: Date;
}

export interface ModuleCompletion {
  moduleId: mongoose.Types.ObjectId;
  completedAt: Date;
}

export interface LearnerProgress extends Document {
  id: string;
  learnerId: ObjectId;
  completedActivities: mongoose.Types.ObjectId[];
  moduleCompletions: ModuleCompletion[];
  lastViewedPage?: LastViewedPage;
}

const LastViewedPageSchema: Schema = new Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoursePage",
      required: true,
    },
    viewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false },
);

const ModuleCompletionSchema: Schema = new Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false },
);

export const LearnerProgressSchema: Schema = new Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    completedActivities: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CoursePage",
      default: [],
    },
    moduleCompletions: {
      type: [ModuleCompletionSchema],
      default: [],
    },
    lastViewedPage: {
      type: LastViewedPageSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Create index for efficient lookups
LearnerProgressSchema.index({ learnerId: 1 });
LearnerProgressSchema.index({ completedActivities: 1 });

LearnerProgressSchema.plugin(mongooseLeanId);

/* eslint-disable no-param-reassign */
LearnerProgressSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model<LearnerProgress>(
  "LearnerProgress",
  LearnerProgressSchema,
);
