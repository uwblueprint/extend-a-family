import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import { ITeamMemberService } from "../interfaces/teamMemberService";
import TeamMemberMgmodel, { TeamMember } from "../../models/teamMember.mgmodel";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class TeamMemberService implements ITeamMemberService {
  /* eslint-disable class-methods-use-this */
  async getTeamMembers(): Promise<TeamMemberDTO[]> {
    try {
      const entities = await TeamMemberMgmodel.find({});
      return entities.map((entity) => ({
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        teamRole: entity.teamRole,
      }));
    } catch (error: unknown) {
      Logger.error(`Failed to get members. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createTeamMember(
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> {
    let newTeamMember: TeamMember;
    try {
      newTeamMember = await TeamMemberMgmodel.create({
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        teamRole: teamMember.teamRole,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create team member`);
      throw error;
    }
    return {
      id: newTeamMember.id,
      firstName: newTeamMember.firstName,
      lastName: newTeamMember.lastName,
      teamRole: newTeamMember.teamRole,
    };
  }
}

export default TeamMemberService;
