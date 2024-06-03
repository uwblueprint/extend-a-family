import { Router } from "express";

import { createTeamMemberDtoValidator } from "../middlewares/validators/teamMemberValidators";
import ITeamMemberService from "../services/interfaces/teamMemberService";
import TeamMemberService from "../services/implementations/teamMemberService";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../types";
import { getErrorMessage } from "../utilities/errorUtils";

const teamMemberRouter: Router = Router();
const teamMemberService: ITeamMemberService = new TeamMemberService();

teamMemberRouter.get("/", async (req, res) => {
  try {
    const teamMembers: TeamMemberDTO[] = await teamMemberService.getTeamMembers();
    res.status(200).json(teamMembers);
  } catch (err: unknown) {
    res.status(500).json({
      error: getErrorMessage(err),
    });
  }
});

teamMemberRouter.post("/", createTeamMemberDtoValidator, async (req, res) => {
  try {
    const newTeamMember: TeamMemberDTO = await teamMemberService.createTeamMember(
      req.body as CreateTeamMemberDTO,
    );
    res.status(200).json(newTeamMember);
  } catch (err: unknown) {
    res.status(500).json({
      error: getErrorMessage(err),
    });
  }
});

export default teamMemberRouter;
