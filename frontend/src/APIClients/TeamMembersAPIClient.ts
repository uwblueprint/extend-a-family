import baseAPIClient from "./BaseAPIClient";
import { TeamMember } from "../types/TeamMemberTypes";

const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data } = await baseAPIClient.get("/team-members");
    return data;
  } catch (error) {
    return [];
  }
};

const createTeamMember = async (
  teamMember: TeamMember,
): Promise<TeamMember | null> => {
  try {
    const { data } = await baseAPIClient.post("/team-members", teamMember);
    return data;
  } catch (error) {
    return null;
  }
};

export default { getTeamMembers, createTeamMember };
