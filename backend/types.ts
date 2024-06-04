export type Role = "User" | "Admin";
export type TeamRole = "PM" | "DESIGNER" | "PL" | "DEVELOPER";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type TeamMemberDTO = {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
};


export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type CreateTeamMemberDTO = Omit<UserDTO, "id"> ;

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type SignupUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type SignupMethod = "PASSWORD" | "GOOGLE";
