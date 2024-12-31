import mongoose, { Schema, Document } from "mongoose";

export type ElementSkeleton = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
};

const ElementSkeletonSchema: Schema = new Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  w: {
    type: Number,
    required: true,
  },
  h: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export type PageType = "Lesson" | "Activity";

export interface CoursePage extends Document {
  id: string;
  title: string;
  displayIndex: number;
  type: PageType;
}

export interface LessonPage extends CoursePage {
  source: string;
}

export interface ActivityPage extends CoursePage {
  layout: [ElementSkeleton];
}

const baseOptions = {
  discriminatorKey: "type",
};

export const CoursePageSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    displayIndex: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Lesson", "Activity"],
    },
  },
  baseOptions,
);

const LessonPageSchema: Schema = new Schema({
  source: {
    type: String,
    required: true,
  },
});

const ActivityPageSchema: Schema = new Schema({
  layout: {
    type: [ElementSkeletonSchema],
    required: true,
  },
});

/* eslint-disable no-param-reassign */
CoursePageSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

const CoursePageModel = mongoose.model<CoursePage>(
  "CoursePage",
  CoursePageSchema,
);

const LessonPageModel = CoursePageModel.discriminator(
  "Lesson",
  LessonPageSchema,
);
const ActivityPageModel = CoursePageModel.discriminator(
  "Activity",
  ActivityPageSchema,
);

export { LessonPageModel, ActivityPageModel };
export default CoursePageModel;
