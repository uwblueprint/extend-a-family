import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Feedback extends Document {
  id: ObjectId;
  learnerId: ObjectId;
  moduleId: ObjectId;
  isLiked: boolean;
  difficulty: number;
  message: string;
}

export const FeedbackSchema: Schema = new Schema(
  {
    learnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    isLiked: {
      type: Boolean,
      required: false,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/* eslint-disable no-param-reassign */
FeedbackSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

export default mongoose.model<Feedback>("Feedback", FeedbackSchema);
