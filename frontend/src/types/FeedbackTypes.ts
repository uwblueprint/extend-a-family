import { CourseModule } from "./CourseTypes";
import { Learner } from "./UserTypes";

export type Feedback = {
  id: string;
  learnerId: string;
  moduleId: string;
  isLiked: boolean;
  difficulty: number;
  message: string;
  createdAt: string;
};

export type FeedbackPopulated = {
  id: string;
  learnerId: Pick<Learner, "id" | "firstName" | "lastName">;
  moduleId: Pick<CourseModule, "id" | "title">;
  isLiked: boolean;
  difficulty: number;
  message: string;
  createdAt: string;
};
