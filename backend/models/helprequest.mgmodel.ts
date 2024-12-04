import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface HelpRequest extends Document {
  id: ObjectId;
  message: string;
  learner: ObjectId;
  facilitator: ObjectId;
  unit: ObjectId;
  module: ObjectId;
  page: ObjectId;
  completed: boolean;
  createdAt: Date;
}

const HelpRequestSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    learner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facilitator: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/* eslint-disable no-param-reassign */
HelpRequestSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

export default mongoose.model<HelpRequest>("HelpRequest", HelpRequestSchema);
