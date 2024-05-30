import { TeamMember } from "../../models/teamMember.mgmodel";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

interface ITeamMemberService {
    getTeamMembers(): Promise<TeamMemberDTO[]>;
    createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;
