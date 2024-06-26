import mongoose, { Schema, Document } from "mongoose";
import { ElementType } from "../types/courseTypes";

export interface CourseElement extends Document {
  type: ElementType;
}

const CourseElementSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
  },
});

export interface RichTextElement extends CourseElement {
  content: string;
  backgroundColor?: string;
}

const RichTextElementSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    required: false,
  },
});

export interface ImageElement extends CourseElement {
  src: string;
  alt: string;
}

const ImageElementSchema: Schema = new Schema({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
});

export interface TextInputElement extends CourseElement {
  correctAnswer?: string;
}

const TextInputElementSchema: Schema = new Schema({
  correctAnswer: {
    type: String,
    required: false,
  },
});

export interface NumberInputElement extends CourseElement {
  correctAnswer?: number;
  prefixText?: string;
  suffixText?: string;
}

const NumberInputElementSchema: Schema = new Schema({
  correctAnswer: {
    type: Number,
    required: false,
  },
  prefixText: {
    type: String,
    required: false,
  },
  suffixText: {
    type: String,
    required: false,
  },
});

const CourseElementModel = mongoose.model<CourseElement>(
  "CourseElement",
  CourseElementSchema,
);

export const RichTextElementModel = CourseElementModel.discriminator(
  "RichTextElement",
  RichTextElementSchema,
);

export const ImageElementModel = CourseElementModel.discriminator(
  "ImageElement",
  ImageElementSchema,
);

export const TextInputElementModel = CourseElementModel.discriminator(
  "TextInputElement",
  TextInputElementSchema,
);

export const NumberInputElementModel = CourseElementModel.discriminator(
  "NumberInputElement",
  NumberInputElementSchema,
);
