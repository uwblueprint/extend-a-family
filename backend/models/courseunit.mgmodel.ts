import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface CourseUnit extends Document {
  id: string;
  displayIndex: number;
  title: string;
  modules: [ObjectId];
}

const CourseUnitSchema: Schema = new Schema({
  displayIndex: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  modules: [
    {
      type: Schema.Types.ObjectId,
      ref: "CourseModule",
    },
  ],
});

/* eslint-disable no-param-reassign */
CourseUnitSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

export default mongoose.model<CourseUnit>("CourseUnit", CourseUnitSchema);
