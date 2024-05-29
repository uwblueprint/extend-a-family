import { Router } from "express";

const userRouter: Router = Router();
userRouter.use();

const teamMemberService: ITeamMemberService = new TeamMemberService();

userRouter.get("/", async (req, res) => {
    
    const contentType = req.headers["content-type"];
  
    if (userId && email) {
      await sendResponseByMimeType(res, 400, contentType, [
        {
          error: "Cannot query by both userId and email.",
        },
      ]);
      return;
    }
  
    if (!userId && !email) {
      try {
        const users = await userService.getUsers();
        await sendResponseByMimeType<UserDTO>(res, 200, contentType, users);
      } catch (error: unknown) {
        await sendResponseByMimeType(res, 500, contentType, [
          {
            error: getErrorMessage(error),
          },
        ]);
      }
      return;
    }
  
  
  
    if (email) {
      if (typeof email !== "string") {
        res
          .status(400)
          .json({ error: "email query parameter must be a string." });
      } else {
        try {
          const user = await userService.getUserByEmail(email);
          res.status(200).json(user);
        } catch (error: unknown) {
          res.status(500).json({ error: getErrorMessage(error) });
        }
      }
    }
  });