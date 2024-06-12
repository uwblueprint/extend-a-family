import mongoose, { Schema, Document } from "mongoose";

type ElementSkeleton = {
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

type Page = {
    id: string
    title: string
    type: "Lesson" | "Activity"
    layout: [ElementSkeleton]
  }
  
  const PageSchema: Schema = new Schema({
    title: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    layout: {
      type: [ElementSkeletonSchema],
      required: true,
    },
});
