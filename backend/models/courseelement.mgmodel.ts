import mongoose, { Schema } from "mongoose";
import {
  DisplayElementType,
  ElementType,
  HybridElementType,
  InteractiveElementType,
} from "../types/courseTypes";

export interface CourseElement {
  type: ElementType;
}

const CourseElementSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "TextInput",
      "NumberInput",
      "CheckboxInput",
      "MultipleChoice",
      "Matching",
      "Table",
      "RichText",
      "Image",
    ],
  },
});

export interface RichTextElement extends CourseElement {
  type: DisplayElementType.RichText;
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
  type: DisplayElementType.Image;
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
  type: InteractiveElementType.TextInput;
  correctAnswer?: string;
}

const TextInputElementSchema: Schema = new Schema({
  correctAnswer: {
    type: String,
    required: false,
  },
});

export interface NumberInputElement extends CourseElement {
  type: InteractiveElementType.NumberInput;
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

export interface CheckboxInputElement extends CourseElement {
  type: InteractiveElementType.CheckboxInput;
  correctAnswer: boolean;
}

const CheckboxInputElementSchema: Schema = new Schema({
  correctAnswer: {
    type: Boolean,
    required: false,
  },
});

export interface MultipleChoiceElement extends CourseElement {
  type: InteractiveElementType.MultipleChoice;
  options: [CourseElement];
  correctAnswer: number;
}

const MultipleChoiceElementSchema: Schema = new Schema({
  options: {
    type: [CourseElementSchema],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: false,
  },
});

export interface MatchingElement extends CourseElement {
  type: InteractiveElementType.Matching;
  columns: number;
  correctAnswer: [[CourseElement]];
}

const MatchingElementSchema: Schema = new Schema({
  columns: {
    type: Number,
    required: true,
  },
  correctAnswer: {
    type: [[CourseElementSchema]],
    required: true,
  },
});

export interface TableElement extends CourseElement {
  type: HybridElementType.Table;
  rows: number;
  columns: number;
  content: [[CourseElement]];
  headerBackgroundColor: string;
}

const TableElementSchema: Schema = new Schema({
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  content: {
    type: [[CourseElementSchema]],
    required: true,
  },
  headerBackgroundColor: {
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

export const CheckboxInputElementModel = CourseElementModel.discriminator(
  "CheckboxInputElement",
  CheckboxInputElementSchema,
);

export const MultipleChoiceElementModel = CourseElementModel.discriminator(
  "MultipleChoiceElement",
  MultipleChoiceElementSchema,
);

export const MatchingElementModel = CourseElementModel.discriminator(
  "MatchingElement",
  MatchingElementSchema,
);

export const TableElementModel = CourseElementModel.discriminator(
  "TableElement",
  TableElementSchema,
);
