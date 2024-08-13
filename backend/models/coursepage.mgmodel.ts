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
  layout: [ElementSkeleton];
}

export const CoursePageSchema: Schema = new Schema({
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
  layout: {
    type: [ElementSkeletonSchema],
    required: true,
  },
});

/* eslint-disable no-param-reassign */
CoursePageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

export default mongoose.model<CoursePage>("CoursePage", CoursePageSchema);
