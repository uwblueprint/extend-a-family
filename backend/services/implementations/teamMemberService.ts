import teamMemberMgmodel from "../../models/teamMember.mgmodel";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import ITeamMemberService from "../interfaces/teamMemberService";

import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename)

class TeamMemberService implements ITeamMemberService {
    async getTeamMembers(): Promise<TeamMemberDTO[]> {
        try {
            const teamMembers: TeamMemberDTO[] = await teamMemberMgmodel.find({});
            return teamMembers;
        } catch (error: unknown) {
            Logger.error(`Failed to get team members. Reason: ${getErrorMessage(error)}`);
            throw error;
        }
    }

    async createTeamMember(
        teamMember: CreateTeamMemberDTO
    ): Promise<TeamMemberDTO> {
        try {
            const newTeamMember: TeamMemberDTO = await teamMemberMgmodel.insertMany(teamMember);
            return newTeamMember;
        } catch (error: unknown) {
            Logger.error(`Failed to create team member. Reason: ${getErrorMessage(error)}`);
            throw error;
        }
    }
}

export default TeamMemberService;
