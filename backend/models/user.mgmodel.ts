import mongoose, { Schema, Document } from "mongoose";

import { Role, Status } from "../types/userTypes";

export interface User extends Document {
  id: string;
  firstName: string;
  lastName: string;
  authId: string;
  role: Role;
  status: Status;
}

const baseOptions = {
  discriminatorKey: "role",
  timestamps: true,
};

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    authId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Administrator", "Facilitator", "Learner"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Invited", "Active"],
    },
  },
  baseOptions,
);

/* eslint-disable no-param-reassign */
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

const UserModel = mongoose.model<User>("User", UserSchema);

const AdministratorSchema = new Schema({});

const FacilitatorSchema = new Schema({
  learners: { type: [String], default: [] },
});

const LearnerSchema = new Schema({
  facilitator: { type: String, required: true },
});

const Administrator = UserModel.discriminator(
  "Administrator",
  AdministratorSchema,
);
const Facilitator = UserModel.discriminator("Facilitator", FacilitatorSchema);
const Learner = UserModel.discriminator("Learner", LearnerSchema);

export { Administrator, Facilitator, Learner };
export default UserModel;
