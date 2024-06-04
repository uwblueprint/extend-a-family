import mongoose, { Schema, Document } from "mongoose";

import { TeamRole } from "../types";

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
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["PM", "DESIGNER", "PL", "DEVELOPER"],
  },
});

export default mongoose.model<TeamMember>("TeamMember", TeamMemberSchema);
