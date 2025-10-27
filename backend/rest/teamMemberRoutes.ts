import { Router } from "express";
import TeamMemberService from "../services/implementations/teamMemberService";
// whys not ITeamMemberService
import { getErrorMessage } from "../utilities/errorUtils";
import { CreateTeamMemberDTO } from "../types";
import { createTeamMemberDtoValidator } from "../middlewares/validators/teamMemberValidator";

const teamMemberRouter: Router = Router();

teamMemberRouter.get("/", async (req, res) => {
    try {
        const teamMembers = await teamMemberService.getTeamMembers();
        res.status(200).json(teamMembers);
    } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});


teamMemberRouter.post("/", createTeamMemberDtoValidator, async(req, res) => {
    const data: CreateTeamMemberDTO = req.body;
    try {
        const newTeamMember = await TeamMemberService.createTeamMember(data);
        res.status(201).json(newTeamMember);
    } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});

export default teamMemberRouter; 