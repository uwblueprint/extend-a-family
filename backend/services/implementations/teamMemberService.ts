import logger from "../../utilities/logger";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
// eslint-disable-next-line import/no-cycle
import ITeamMemberService from "../interfaces/teamMemberService";
import TeamMember from "../../models/teamMember.mgmodel";

class TeamMemberService implements ITeamMemberService {
  private logger = logger(__filename);

  async getTeamMembers(): Promise<TeamMemberDTO[]> {
    try {
      const teamMembers = await TeamMember.find({});
      this.logger.info(`Retrieved ${teamMembers.length} team members`);
      return teamMembers.map((teamMember) => ({
        id: teamMember.id,
        teamRole: teamMember.teamRole,
        lastName: teamMember.firstName,
        firstName: teamMember.lastName,
      }));
    } catch (error: unknown) {
      this.logger.error(`Failed to get team members. Error: ${error}`);
      throw error;
    }
  }

  async createTeamMember(
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> {
    try {
      const newTeamMember = await TeamMember.create(teamMember);
      return {
        id: newTeamMember.id,
        teamRole: newTeamMember.teamRole,
        lastName: newTeamMember.firstName,
        firstName: newTeamMember.lastName,
      };
    } catch (error: unknown) {
      this.logger.error(`Failed to create team member. Error: ${error}`);
      throw error;
    }
  }
}

export default TeamMemberService;
