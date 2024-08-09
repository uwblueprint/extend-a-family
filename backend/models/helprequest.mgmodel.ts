import mongoose, { Schema, Document } from "mongoose";

export interface HelpRequest extends Document {
  id: string;
  message: string;
  learner: string;
  facilitator: string;
  unit: string;
  module: string;
  page: string;
}

const HelpRequestSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    learner: {
      type: String,
      required: true,
    },
    facilitator: {
      type: String,
      required: true,
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "CourseUnit",
      required: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: "CoursePage",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<HelpRequest>("HelpRequest", HelpRequestSchema);
