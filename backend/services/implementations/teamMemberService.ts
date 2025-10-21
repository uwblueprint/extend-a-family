import ITeamMemberService from "../interfaces/teamMemberService";
import logger from "../../utilities/logger";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import MgTeamMember from "../../models/teamMember.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class TeamMemberService implements ITeamMemberService {
    getTeamMembers = async (): Promise<TeamMemberDTO[]> => {
        try {
            const teamMembers: TeamMemberDTO[] = await MgTeamMember.find();
            return teamMembers;
        } catch (error: unknown) {
            Logger.error(`Failed to get team members. Reason = ${getErrorMessage(error)}`,);
            throw error; 
        }
    }

    // not js teammemberdto bc create contains only the fields provided by client
    createTeamMember = async ( teamMember: CreateTeamMemberDTO,) : Promise<TeamMemberDTO> => {
        try {
           const newTeamMember = await MgTeamMember.create(teamMember,); 
           return newTeamMember; 
        } catch (error: unknown) {
            Logger.error('Failed to create new team members. Reason = ${getErrorMessage(error)}'); 
            throw error; 
        }
    }
}

export default TeamMemberService; 