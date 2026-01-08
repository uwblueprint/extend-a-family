import { CoursePage } from "./CourseTypes";
import { Facilitator, Learner } from "./UserTypes";

export interface HelpRequest {
  id: string;
  message: string;
  learner: Learner;
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
  page: CoursePage;
  completed: boolean;
  createdAt: string;
}
