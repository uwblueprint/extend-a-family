import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

interface ITeamMemberService {
  getTeamMembers(): Promise<TeamMemberDTO[]>;
  createTeamMembers(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;
