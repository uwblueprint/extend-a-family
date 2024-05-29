import { Schema, Document, model } from "mongoose";
import { TeamRole } from "../types";

export interface Entity extends Document {
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
    required: true,
    enum: ["PM", "DESIGNER", "PL", "DEVELOPER"],
  },
});

export default model<Entity>("TeamMember", TeamMemberSchema);
