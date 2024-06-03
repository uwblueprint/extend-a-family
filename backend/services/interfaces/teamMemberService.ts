import { CreateTeamMemberDTO, TeamMemberDTO } from "../../";

interface ITeamMemberService {
  getTeamMembers(): Promise<TeamMemberDTO[]>;
  createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;
