import mongoose, { Schema, Document } from "mongoose";

export interface HelpRequest extends Document {
  id: string;
  message: string;
  learner: string;
  facilitator: string;
  unit: number;
  module: number;
  page: number;
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
      type: Number,
      required: true,
    },
    module: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<HelpRequest>("HelpRequest", HelpRequestSchema);
