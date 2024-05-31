import { TeamMember, TeamRole } from "../types/TeamMemberTypes";
import baseAPIClient from "./BaseAPIClient";

const getTeamMembers = async (): Promise<TeamMember[] | null> => {
  try {
    const { data } = await baseAPIClient.get("/team-members/");
    return data;
  } catch (error) {
    return null;
  }
};

const createTeamMember = async (
  firstName: string,
  lastName: string,
  email: string,
  teamRole: TeamRole,
): Promise<TeamMember | null> => {
  try {
    const { data } = await baseAPIClient.post("/team-members/", {
      firstName,
      lastName,
      email,
      teamRole,
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default { getTeamMembers, createTeamMember };
