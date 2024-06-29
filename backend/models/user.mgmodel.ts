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

const User = mongoose.model<User>("User", UserSchema);

const FacilitatorSchema = new Schema({
  learners: { type: [String], default: [] },
});
>>>>>>> 17d46aa (added discriminator for learner and facilitator)

const LearnerSchema = new Schema({
  facilitator: { type: String, required: true },
});

const Facilitator = User.discriminator("Facilitator", FacilitatorSchema);
const Learner = User.discriminator("Learner", LearnerSchema);

export { User, Facilitator, Learner };
export default User;
