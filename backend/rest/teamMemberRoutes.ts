import { Router } from "express";

import { createUserDtoValidator } from "../middlewares/validators/userValidators";
import { getErrorMessage } from "../utilities/errorUtils";
import TeamMemberService from "../services/implementations/teamMemberService";

const teamMemberRouter: Router = Router();
const teamMemberService = new TeamMemberService();

teamMemberRouter.get("/", async (req, res) => {
  try {
    const members = await teamMemberService.getTeamMembers();
    res.json(members);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

teamMemberRouter.post("/", createUserDtoValidator, async (req, res) => {
  try {
    const newTeamMember = await teamMemberService.createTeamMember({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      teamRole: req.body.teamRole,
    });
    res.status(201).json(newTeamMember);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default teamMemberRouter;
