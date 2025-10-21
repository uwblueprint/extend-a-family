import { CreateTeamMemberDTO } from "../../types/types";

interface ITeamMemberService {
    getTeamMembers(): Promise<TeamMemberDto[]>;
    createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;