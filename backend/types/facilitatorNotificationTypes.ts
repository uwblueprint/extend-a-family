import { ObjectId } from "mongoose";

export type EnrichedNotificationData = {
  notificationId: ObjectId;
  helpRequestId: ObjectId;
  message: string;
  createdAt: Date;
  learnerName: string;
  learnerProfilePicture: string;
  moduleTitle: string;
  moduleNumber: string;
  modulePage: string;
  unitId: string;
  moduleId: string;
  moduleLink: string;
  respondLink: string;
  messageDate: string;
  messageTime: string;
};
