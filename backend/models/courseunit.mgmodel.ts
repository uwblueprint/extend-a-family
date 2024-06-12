import { Schema, Document, model } from "mongoose";


//Module
type Module = {
    id: String;
    title: String;
    pages: [Page];
}

const ModuleSchema: Schema = new Schema({
    id: {
      type: String,
      required: true,
    },
    title: {
      type: Number,
      required: true,
    },
    pages: {
      type: [PageSchema],
      required: true,
    },
  });


//Course Unit
export interface CourseUnit extends Document {
    id: String;
    displayIndex: number;
    title: String;
    modules: [Module]
}

const CourseUnitSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
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
  }
});

export default mongoose.model<CourseUnit>("CourseUnit", CourseUnitSchema);
