import mongoose, { Document, ObjectId, Schema } from "mongoose";

import { Role, Status } from "../types/userTypes";

export interface User extends Document {
  id: ObjectId;
  firstName: string;
  lastName: string;
  authId: string;
  role: Role;
  status: Status;
  email: string;
  profilePicture?: string;
  bookmarks: Bookmark[];
}

export interface Bookmark {
  id: mongoose.Types.ObjectId;
  title: string;
  type: string;
  unitId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  pageId: mongoose.Types.ObjectId;
}

export interface Learner extends User {
  facilitator: ObjectId;
}

export interface Facilitator extends User {
  learners: Array<ObjectId>;
  bio?: string;
  emailPrefrence: number;
}

const options = {
  discriminatorKey: "role",
  timestamps: true,
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: Document, ret: Record<string, unknown>) => {
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      delete ret._id;
      // eslint-disable-next-line no-param-reassign
      delete ret.createdAt;
      // eslint-disable-next-line no-param-reassign
      delete ret.updatedAt;
    },
  },
};

export const BookmarkSchema: Schema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  type: { type: String },
  unitId: { type: mongoose.Types.ObjectId },
  pageId: { type: mongoose.Types.ObjectId },
  moduleId: { type: mongoose.Types.ObjectId },
});

export const UserSchema: Schema = new Schema(
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
      enum: ["Invited", "Active", "PendingApproval"],
    },
    email: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bookmarks: {
      type: [BookmarkSchema],
      default: [],
      required: true,
    },
  },
  options,
);

const UserModel = mongoose.model<User>("User", UserSchema);

const AdministratorSchema = new Schema({}, options);

const FacilitatorSchema = new Schema(
  {
    learners: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    bio: {
      type: String,
      required: false,
    },
    emailPrefrence: {
      type: Number,
      required: true,
      default: 1, // Default to daily email notifications
    },
  },
  options,
);

const LearnerSchema = new Schema(
  {
    facilitator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  options,
);

const AdministratorModel = UserModel.discriminator(
  "Administrator",
  AdministratorSchema,
);
const FacilitatorModel = UserModel.discriminator<Facilitator>(
  "Facilitator",
  FacilitatorSchema,
);
const LearnerModel = UserModel.discriminator<Learner>("Learner", LearnerSchema);

export { AdministratorModel, FacilitatorModel, LearnerModel };
export default UserModel;
