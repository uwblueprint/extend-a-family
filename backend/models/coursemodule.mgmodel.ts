import mongoose, { Document, ObjectId, Schema } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";

export interface CourseModule extends Document {
  id: string;
  displayIndex: number;
  title: string;
  pages: [ObjectId];
  imageURL: string;
  status: "draft" | "published" | "unpublished";
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
  status: {
    type: String,
    enum: ["draft", "published", "unpublished"],
    default: "draft",
    required: true,
  },
});

CourseModuleSchema.plugin(mongooseLeanId);

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
