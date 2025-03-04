import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface CourseModule extends Document {
  id: string;
  displayIndex: number;
  title: string;
  pages: [ObjectId];
  imageURL: string;
}

export const CourseModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  displayIndex: {
    type: Number,
    required: true,
  },
  pages: [
    {
      type: Schema.Types.ObjectId,
      ref: "CoursePage",
    },
  ],
  imageURL: {
    type: String,
  },
});

/* eslint-disable no-param-reassign */
CourseModuleSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  flattenObjectIds: true,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

export default mongoose.model<CourseModule>("CourseModule", CourseModuleSchema);
