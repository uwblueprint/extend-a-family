export type Role = "Administrator" | "Facilitator" | "Learner";

export function isRole(role: string): role is Role {
  return (
    role === "Administrator" || role === "Facilitator" || role === "Learner"
  );
}

export type Status = "Invited" | "Active";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: Status;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type SignupUserDTO = Omit<CreateUserDTO, "role">;

export type AdminDTO = UserDTO;

export function isAdministrator(user: UserDTO): user is AdminDTO {
  return user.role === "Administrator";
}

export type FacilitatorDTO = UserDTO & {
  learners: string[];
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
