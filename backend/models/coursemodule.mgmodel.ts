import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface CourseModule extends Document {
  id: string;
  displayIndex: number;
  title: string;
  pages: [ObjectId];
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
});

export default mongoose.model<CourseModule>("CourseModule", CourseModuleSchema);
