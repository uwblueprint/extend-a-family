import { ObjectId } from "mongoose";

export type HelpRequestDTO = {
  id: ObjectId;
  message: string;
  learner: ObjectId;
  facilitator: ObjectId;
  unit: ObjectId;
  module: ObjectId;
  page: ObjectId;
};

export type CreateHelpRequestDTO = Omit<HelpRequestDTO, "id">;

// export type GetHelpRequestDTO = TODO
