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

<<<<<<< HEAD
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
  { timestamps: true },
);
=======
const baseOptions = {
  discriminatorKey: "role",
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

const AdministratorSchema = new Schema({});

const FacilitatorSchema = new Schema({
  learners: { type: [String], default: [] },
});
>>>>>>> 17d46aa (added discriminator for learner and facilitator)

const LearnerSchema = new Schema({
  facilitator: { type: String, required: true },
});

const Administrator = UserModel.discriminator("Administrator", AdministratorSchema);
const Facilitator = UserModel.discriminator("Facilitator", FacilitatorSchema);
const Learner = UserModel.discriminator("Learner", LearnerSchema);

export { Facilitator, Learner };
export default UserModel;
