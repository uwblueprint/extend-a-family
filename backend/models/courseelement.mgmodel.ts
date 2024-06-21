import mongoose, { Schema, Document } from "mongoose";
import { ElementType } from "../types/courseTypes";

export interface CourseElement extends Document {
  type: ElementType;
}

const CourseElementSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.model<CourseElement>(
  "CourseElement",
  CourseElementSchema,
);
