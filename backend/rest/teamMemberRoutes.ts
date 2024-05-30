import { Router } from "express";

import { createTeamMemberDtoValidator } from "../middlewares/validators/teamMemberValidators";
import ITeamMemberService from "../services/interfaces/teamMemberService"
import TeamMemberService from "../services/implementations/teamMemberService"

const teamMemberRouter: Router = Router()
// const teamMemberService: TeamMemberService

teamMemberRouter.get("/", async(req, res) => {
    
})
