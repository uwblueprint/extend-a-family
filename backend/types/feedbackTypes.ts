import { ObjectId } from "mongoose";

export type FeedbackDTO = {
  id: ObjectId;
  learnerId: ObjectId;
  moduleId: ObjectId;
  isLiked?: boolean;
  difficulty?: number;
  message?: string;
};

export type CreateFeedbackDTO = Omit<FeedbackDTO, "id">;
