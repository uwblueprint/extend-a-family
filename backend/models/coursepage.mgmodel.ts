import mongoose, { Document, Schema } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";
import { ElementSkeleton, PageType } from "../types/courseTypes";

// const ElementSkeletonSchema: Schema = new Schema({
//   x: {
//     type: Number,
//     required: true,
//   },
//   y: {
//     type: Number,
//     required: true,
//   },
//   w: {
//     type: Number,
//     required: true,
//   },
//   h: {
//     type: Number,
//     required: true,
//   },
//   content: {
//     type: ObjectId,
//     required: true,
//     ref: "CourseElement",
//   },
// });

export interface CoursePageBase extends Document {
  id: string;
  title: string;
  type: PageType;
}

export interface LessonPage extends CoursePageBase {
  type: "Lesson";
  source: string;
  pageIndex: number;
}

export interface ActivityPage extends CoursePageBase {
  type: "Activity";
  layout: [ElementSkeleton];
}

export type CoursePage = LessonPage | ActivityPage;

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
      enum: ["Lesson", "MultipleChoiceActivity", "MultiSelectActivity"],
    },
  },
  baseOptions,
);

const LessonPageSchema: Schema = new Schema({
  source: {
    type: String,
    required: true,
  },
  pageIndex: {
    type: Number,
    required: true,
  },
});

// const ActivityPageSchema: Schema = new Schema({
//   layout: {
//     type: [ElementSkeletonSchema],
//     required: true,
//   },
// });

/* eslint-disable no-param-reassign */
CoursePageSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

CoursePageSchema.plugin(mongooseLeanId);

const CoursePageModel = mongoose.model<CoursePage>(
  "CoursePage",
  CoursePageSchema,
);

const LessonPageModel = CoursePageModel.discriminator(
  "Lesson",
  LessonPageSchema,
);

export { LessonPageModel };
export default CoursePageModel;
