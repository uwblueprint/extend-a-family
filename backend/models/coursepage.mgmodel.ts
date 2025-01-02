import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { ElementSkeleton, PageType } from "../types/courseTypes";

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
    type: ObjectId,
    required: true,
    ref: "CourseElement",
  },
});

export interface CoursePage extends Document {
  id: string;
  title: string;
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
