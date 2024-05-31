import { Schema, Document, model } from "mongoose";

import { TeamRole, teamRoleValues } from "../types";

export interface TeamMember extends Document {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
}

const TeamMemberSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: Number,
    required: true,
  },
  teamRole: {
    type: String,
    enum: teamRoleValues,
    required: true,
  },
});

export default model<TeamMember>("TeamMember", TeamMemberSchema);
