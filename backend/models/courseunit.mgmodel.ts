import mongoose, { Schema, Document } from "mongoose";
import { PageType } from "../types/courseTypes";

export type ElementSkeleton = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
};

const ElementSkeletonSchema: Schema = new Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  w: {
    type: Number,
    required: true,
  },
  h: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export type Page = {
  id: string;
  title: string;
  type: PageType;
  layout: [ElementSkeleton];
};

const PageSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Lesson", "Activity"],
  },
  layout: {
    type: [ElementSkeletonSchema],
    required: true,
  },
});

export type Module = {
  id: string;
  title: string;
  pages: [Page];
};

const ModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  pages: {
    type: [PageSchema],
    required: true,
  },
});

// Course Unit
export interface CourseUnit extends Document {
  id: string;
  displayIndex: number;
  title: string;
  modules: [Module];
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
  module: {
    type: [ModuleSchema],
    required: true,
  },
});

export default mongoose.model<CourseUnit>("CourseUnit", CourseUnitSchema);
