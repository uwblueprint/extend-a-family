import ITeamMemberService from "../interfaces/teamMemberService";
import logger from "../../utilities/logger";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import MgTeamMember from "../../models/teamMember.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

function getTeamMemberObjectFromQueryResult(
  queryResult: TeamMemberDTO,
): TeamMemberDTO {
  return {
    id: queryResult.id,
    firstName: queryResult.firstName,
    lastName: queryResult.lastName,
    teamRole: queryResult.teamRole,
  };
}
class TeamMemberService implements ITeamMemberService {
  /* eslint-disable class-methods-use-this */
  getTeamMembers = async (): Promise<TeamMemberDTO[]> => {
    try {
      const teamMembers: TeamMemberDTO[] = await MgTeamMember.find({});
      return teamMembers.map(getTeamMemberObjectFromQueryResult);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get team members. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  };

  createTeamMember = async (
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> => {
    try {
      const newTeamMember: TeamMemberDTO = await MgTeamMember.create(
        teamMember,
      );
      return getTeamMemberObjectFromQueryResult(newTeamMember);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create team member. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  };
  
}

export default TeamMemberService;
