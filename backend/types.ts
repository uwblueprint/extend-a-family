export type TeamRole = "PM" | "DESIGNER" | "PL" | "DEVELOPER";

export type TeamMemberDTO = {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
};

export type CreateTeamMemberDTO = Omit<TeamMemberDTO, "id">;
