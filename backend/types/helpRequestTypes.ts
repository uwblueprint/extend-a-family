import { ObjectId } from "mongoose";

export type HelpRequestDTO = {
  id: ObjectId;
  message: string;
  learner: ObjectId;
  facilitator: ObjectId;
  unit: ObjectId;
  module: ObjectId;
  page: ObjectId;
  completed: boolean;
};

export type CreateHelpRequestDTO = Omit<HelpRequestDTO, "id" | "completed">;

export type UpdateHelpRequestDTO = {
  unit?: ObjectId;
  module?: ObjectId;
  page?: ObjectId;
  completed?: boolean;
};
