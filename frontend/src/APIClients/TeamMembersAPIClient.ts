// calls get and post for teammember? 

import { TeamMemberDTO, TeamRole } from "../types/TeamMemberTypes";
import baseAPIClient from "./BaseAPIClient";

const get = async (): Promise<TeamMemberDTO[] | null> => {
    try {
        const { data } = await baseAPIClient.get("team-memberes/");
        return data;
    } catch (error: unknown) {
        return null;
    }
};

const create = async (
    firstName: string,
    lastName: string,
    teamRole: TeamRole,
): Promise<TeamMemberDTO[] | null> => {
    try {
        const { data } = await baseAPIClient.post("team-members/", {
            firstName,
            lastName,
            teamRole,
        });
        return data;
    } catch (error: unknown) {
        return null;
    }
};

export default { get, create }; 
