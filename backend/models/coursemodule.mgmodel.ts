import mongoose, { Document, ObjectId, Schema } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";
import { ModuleStatus } from "../types/courseTypes";

export interface CourseModule extends Document {
  id: string;
  title: string;
  pages: [ObjectId];
  imageURL: string;
  status: ModuleStatus;
  displayIndex: number;
  unitId?: string;
  unitDisplayIndex?: number;
}

export const CourseModuleSchema: Schema = new Schema({
  title: {
    type: String,
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
  displayIndex: {
    type: Number,
    required: true,
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: "CourseUnit",
  },
  unitDisplayIndex: {
    type: Number,
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

// eslint-disable-next-line func-names
CourseModuleSchema.pre("save", function (next) {
  let pageIndex = 1;
  (this as unknown as CourseModule).pages.forEach((page, index) => {
    mongoose
      .model("CoursePage")
      .findByIdAndUpdate(page, { pageIndex }, { new: true })
      .exec();
    pageIndex += 1;
    (this as unknown as CourseModule).pages[index] = page;
  });
  next();
});

export default mongoose.model<CourseModule>("CourseModule", CourseModuleSchema);
