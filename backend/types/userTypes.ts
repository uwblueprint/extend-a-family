import { CoursePageDTO } from "./courseTypes";

export type Role = "Administrator" | "Facilitator" | "Learner";

export function isRole(role: string): role is Role {
  return (
    role === "Administrator" || role === "Facilitator" || role === "Learner"
  );
}

export type Status = "Invited" | "Active" | "PendingApproval";

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
  bookmarks: BookmarkDTO[];
};

export type CreateUserDTO = Omit<UserDTO, "id" | "bookmarks"> & {
  password: string;
};

type UserOmmitedDTO = Omit<UserDTO, "id" | "email" | "bookmarks">;

export type UpdateUserDTO = UserOmmitedDTO & {
  bio?: string;
  emailPrefrence?: number;
};

export type SignupUserDTO = Omit<CreateUserDTO, "role">;

export type AdminDTO = UserDTO;

export function isAdministrator(user: UserDTO): user is AdminDTO {
  return user.role === "Administrator";
}

export type FacilitatorDTO = UserDTO & {
  learners: string[];
  bio?: string;
  emailPrefrence: number;
};

export function isFacilitator(user: UserDTO): user is FacilitatorDTO {
  return user.role === "Facilitator";
}

export type LearnerDTO = UserDTO & {
  facilitator: string;
};

export function isLearner(user: UserDTO): user is LearnerDTO {
  return user.role === "Learner";
}
