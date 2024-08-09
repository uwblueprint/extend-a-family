import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface HelpRequest extends Document {
  id: ObjectId;
  message: string;
  learner: ObjectId;
  facilitator: ObjectId;
  unit: ObjectId;
  module: ObjectId;
  page: ObjectId;
}

const HelpRequestSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facilitator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseUnit",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoursePage",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<HelpRequest>("HelpRequest", HelpRequestSchema);
