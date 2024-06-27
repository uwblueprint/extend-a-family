export type Role = "Administrator" | "Facilitator" | "Learner";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type SignupUserDTO = Omit<CreateUserDTO, "role">;

export function isRole(role: string): role is Role {
  return (
    role === "Administrator" || role === "Facilitator" || role === "Learner"
  );
}
