export type TeamRole = "DEVELOPER" | "DESIGNER" | "PL" | "PM";

export type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
};
