import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Notification extends Document {
  id: ObjectId;
  message: string;
  user: ObjectId;
  read: boolean;
  createdAt: Date;
  link: string;
}

export const NotificationSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

// eslint-disable-next-line func-names
NotificationSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  next();
});

// eslint-disable-next-line func-names
NotificationSchema.post("save", function (notification) {
  if (this.wasNew) notification.schema.emit("notificationSaved", notification);
});

export default mongoose.model<Notification>("Notification", NotificationSchema);
