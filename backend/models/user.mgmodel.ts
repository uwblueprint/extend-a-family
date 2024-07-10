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
  discriminatorKey: "type",
  collection: "user",
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
  },
  baseOptions,
);

const UserModel = mongoose.model<User>("User", UserSchema);

const FacilitatorSchema = new Schema({
  learners: { type: [String], default: [] },
});

const LearnerSchema = new Schema({
  facilitator: { type: String, required: true },
});

const Facilitator = UserModel.discriminator("Facilitator", FacilitatorSchema);
const Learner = UserModel.discriminator("Learner", LearnerSchema);

export { Facilitator, Learner };
export default UserModel;
