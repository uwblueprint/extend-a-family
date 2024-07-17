import mongoose, { Schema, Document } from "mongoose";
import { User, UserSchema } from "./user.mgmodel";

export interface Notification extends Document {
  id: string;
  message: string;
  user: User;
  read: boolean;
  createdAt: Date;
  link: string;
}

const NotificationSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: UserSchema,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<Notification>("Notification", NotificationSchema);
