/**
 * mongoose database model: 
 * exports teammembermodel which is what ull use to perform db operations
 */
import mongoose, { Schema, Document } from "mongoose"
import { TeamRole } from "../types/types";

export interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    teamRole: TeamRole;
}

export const TeamMemberSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
    },
    firstName: {
        type: String, 
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    teamRole: {
        type: String,
        required: true,
        enum: ["PM", "DESIGNER", "PL", "DEVELOPER"];
    },
});
const TeamMemberModel = mongoose.model<TeamMember>("TeamMember", TeamMemberSchema);
export default TeamMemberModel;