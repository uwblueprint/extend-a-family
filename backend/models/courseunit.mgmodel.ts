import mongoose, { Document, ObjectId, Schema } from "mongoose";

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
CourseUnitSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  flattenObjectIds: true,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
  },
});

CourseUnitSchema.post(
  /^(findOneAndUpdate|updateOne|updateMany|findByIdAndUpdate)$/,
  // eslint-disable-next-line func-names
  function (doc: CourseUnit) {
    doc.modules.forEach((moduleId, index) => {
      mongoose
        .model("CourseModule")
        .findByIdAndUpdate(
          moduleId,
          {
            displayIndex: index + 1,
            unitId: doc.id,
            unitDisplayIndex: doc.displayIndex,
          },
          { new: true },
        )
        .exec();
    });
  },
);

export default mongoose.model<CourseUnit>("CourseUnit", CourseUnitSchema);
