import { CoursePageDTO } from "./courseTypes";

export type Role = "Administrator" | "Facilitator" | "Learner";

export function isRole(role: string): role is Role {
  return (
    role === "Administrator" || role === "Facilitator" || role === "Learner"
  );
}

export type Status = "Invited" | "Active";

export type BookmarkDTO = CoursePageDTO & {
  id: string;
  title: string;
  type: string;
  unitId: string;
  moduleId: string;
  pageId: string;
};

export type UserDTO = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: Status;
  profilePicture?: string;
  bio?: string;
  bookmarks: BookmarkDTO[];
};

export type CreateUserDTO = Omit<UserDTO, "id" | "bookmarks"> & {
  password: string;
};

export type UpdateUserDTO = Omit<UserDTO, "id" | "email" | "bookmarks">;

export type SignupUserDTO = Omit<CreateUserDTO, "role">;

export type AdminDTO = UserDTO;

export function isAdministrator(user: UserDTO): user is AdminDTO {
  return user.role === "Administrator";
}

export type FacilitatorDTO = UserDTO & {
  learners: string[];
  bio?: string;
};

export function isFacilitator(user: UserDTO): user is FacilitatorDTO {
  return user.role === "Facilitator";
}

export type LearnerDTO = UserDTO & {
  facilitator: string;
  activitiesCompleted: Map<string, Map<string, string[]>>;
};

export function isLearner(user: UserDTO): user is LearnerDTO {
  return user.role === "Learner";
}
