export const teamRoleValues = ["PM", "DESIGNER", "PL", "DEVELOPER"] as const;
export type TeamRole = (typeof teamRoleValues)[number];

export type TeamMemberDTO = {
    id: string;
    firstName: string;
    lastName: string;
    teamRole: TeamRole;
};

export type CreateTeamMemberDTO = Omit<TeamMemberDTO, "id">; // since id is generated
