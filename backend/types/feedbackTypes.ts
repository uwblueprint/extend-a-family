import { ObjectId } from "mongoose";

export type Feedback = {
  id: ObjectId;
  learnerId: ObjectId;
  moduleId: ObjectId;
  unitId: ObjectId;
  isLiked?: boolean;
  difficulty?: number;
  message?: string;
};

export type CreateFeedbackDTO = Omit<Feedback, "id">;
