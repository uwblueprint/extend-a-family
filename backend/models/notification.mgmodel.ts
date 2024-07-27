import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  id: string;
  message: string;
  user: string;
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
      type: String,
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
