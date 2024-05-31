import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

export interface ITeamMemberService {
  getTeamMembers(): Promise<TeamMemberDTO[]>;

  createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}
