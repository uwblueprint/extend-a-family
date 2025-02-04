import mongoose, { Schema, Document } from "mongoose";
import { Element, PageType } from "../types/courseTypes";
import { validateElementData } from "../utilities/courseUtils";

const ElementSchema: Schema = new Schema(
  {
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
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

ElementSchema.path("data").validate((value) => {
  if (!value || !value.type) {
    return false;
  }
  return validateElementData(value);
});

export interface CoursePage extends Document {
  id: string;
  type: PageType;
}

export interface LessonPage extends CoursePage {
  source: string;
}

export interface ActivityPage extends CoursePage {
  elements: Element[];
}

const baseOptions = {
  discriminatorKey: "type",
};

export const CoursePageSchema: Schema = new Schema(
  {
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
  elements: {
    type: [ElementSchema],
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
