import { Facilitator, Learner } from "./UserTypes";

export interface HelpRequest {
  id: string;
  message: string;
  learner: Pick<Learner, "id" | "firstName" | "lastName">;
  facilitator: Pick<Facilitator, "id">;
  unit: {
    id: string;
    displayIndex: number;
    title: string;
  };
  module: {
    id: string;
    displayIndex: number;
    title: string;
  };
  page: {
    id: string;
    title: string;
  };
  completed: boolean;
  createdAt: string;
}
