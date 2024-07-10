import mongoose, { Schema, Document } from "mongoose";
import {
  Facilitator,
  FacilitatorSchema,
  Learner,
  LearnerSchema,
} from "./user.mgmodel";

export interface HelpRequest extends Document {
  id: string;
  message: string;
  learner: typeof Learner;
  facilitator: typeof Facilitator;
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
      type: LearnerSchema,
      required: true,
    },
    facilitator: {
      type: FacilitatorSchema,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<HelpRequest>("HelpRequest", HelpRequestSchema);
