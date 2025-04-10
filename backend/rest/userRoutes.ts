import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { getAccessToken, isAuthorizedByRole } from "../middlewares/auth";
import {
  addBookmarkValidator,
  completeActivityValidator,
  createUserDtoValidator,
  deleteBookmarkValidator,
  updateUserAccountValidator,
  updateUserDtoValidator,
  uploadProfilePictureValidator,
} from "../middlewares/validators/userValidators";
import UserModel, { Bookmark, LearnerModel } from "../models/user.mgmodel";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import CoursePageService from "../services/implementations/coursePageService";
import CourseModuleService from "../services/implementations/courseModuleService";
import CourseUnitService from "../services/implementations/courseUnitService";
import EmailService from "../services/implementations/emailService";
import FileStorageService from "../services/implementations/fileStorageService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import ICoursePageService from "../services/interfaces/coursePageService";
import ICourseModuleService from "../services/interfaces/courseModuleService";
import ICourseUnitService from "../services/interfaces/courseUnitService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import {
  UpdateUserDTO,
  UserDTO,
  isFacilitator,
  isLearner,
  isRole,
} from "../types/userTypes";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { capitalizeFirstLetter } from "../utilities/StringUtils";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRouter: Router = Router();

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);
const coursePageService: ICoursePageService = new CoursePageService();
const courseUnitService: ICourseUnitService = new CourseUnitService();
const courseModuleService: ICourseModuleService = new CourseModuleService();
const firebaseStorageService: FileStorageService = new FileStorageService(
  process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "",
);

userRouter.post(
  "/:userId/uploadProfilePicture",
  upload.single("uploadedImage"),
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  uploadProfilePictureValidator,
  async (req, res) => {
    const { userId } = req.params;
    const imageData = req.file?.buffer;
    const contentType = req.file?.mimetype;
    const imageName = `user/profilePicture/${userId}`;

    try {
      const imageURL: string = await firebaseStorageService.uploadImage(
        imageName,
        imageData,
        contentType,
      );
      const userDTO: UserDTO = await userService.getUserById(userId);
      const updatedUser = await userService.updateUserById(userId, {
        ...userDTO,
        profilePicture: imageURL,
      });
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

userRouter.put(
  "/updateMyAccount",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  updateUserAccountValidator,
  async (req, res) => {
    const accessToken = getAccessToken(req);
    try {
      if (!accessToken) {
        throw new Error("Unauthorized: No access token provided");
      }
      const userId = await authService.getUserIdFromAccessToken(accessToken);

      const oldUser: UserDTO = await userService.getUserById(userId.toString());
      const updatedUser = await userService.updateUserById(userId.toString(), {
        ...oldUser,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
      });
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

userRouter.post(
  "/addBookmark",
  isAuthorizedByRole(new Set(["Learner", "Administrator", "Facilitator"])),
  addBookmarkValidator,
  async (req, res) => {
    const { unitId, moduleId, pageId } = req.body;
    const accessToken = getAccessToken(req);
    try {
      const userId = await authService.getUserIdFromAccessToken(accessToken!);

      const page = await coursePageService.getCoursePage(pageId, true);

      const bookmark: Bookmark = {
        ...page,
        id: new mongoose.Types.ObjectId(page.id),
        unitId: new mongoose.Types.ObjectId(unitId as string),
        moduleId: new mongoose.Types.ObjectId(moduleId as string),
        pageId: new mongoose.Types.ObjectId(pageId as string),
      };

      const existingBookmark = await UserModel.findOne({
        _id: userId,
        bookmarks: {
          $elemMatch: {
            unitId: bookmark.unitId,
            moduleId: bookmark.moduleId,
            pageId: bookmark.pageId,
          },
        },
      });

      if (existingBookmark) {
        return res.status(400).json({ error: "Bookmark already exists" });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: bookmark } },
        { runValidators: true, new: true },
      );
      if (!updatedUser) {
        throw new Error("Failed to add bookmark: user not found");
      }
      return res.status(200).json(updatedUser.bookmarks);
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

userRouter.post(
  "/deleteBookmark",
  isAuthorizedByRole(new Set(["Learner", "Administrator", "Facilitator"])),
  deleteBookmarkValidator,
  async (req, res) => {
    const { pageId } = req.body;
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }

    try {
      const userId = await authService.getUserIdFromAccessToken(accessToken);

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            bookmarks: {
              pageId: new mongoose.Types.ObjectId(pageId as string),
            },
          },
        },
        { runValidators: true, new: true },
      );
      if (!updatedUser) {
        throw new Error("Failed to add bookmark: user not found");
      }
      res.status(200).json(updatedUser.bookmarks);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Get current user data including bookmarks */
userRouter.get(
  "/myaccount",
  isAuthorizedByRole(new Set(["Administrator", "Facilitator", "Learner"])),
  async (req, res) => {
    const accessToken = getAccessToken(req);
    try {
      if (!accessToken) {
        throw new Error("Unauthorized: No access token provided");
      }
      const userId = await authService.getUserIdFromAccessToken(accessToken);
      const user = await userService.getUserById(userId.toString());
      res.status(200).json(user);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Get all users, optionally filter by a userId or email query parameter to retrieve a single user */
userRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { userId, email } = req.query;
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

    if (userId) {
      if (typeof userId !== "string") {
        res
          .status(400)
          .json({ error: "userId query parameter must be a string." });
      } else {
        try {
          const user = await userService.getUserById(userId);
          res.status(200).json(user);
        } catch (error: unknown) {
          res.status(500).json({ error: getErrorMessage(error) });
        }
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
  },
);

/* Create a user */
userRouter.post(
  "/",
  isAuthorizedByRole(new Set(["Administrator"])),
  createUserDtoValidator,
  async (req, res) => {
    try {
      const newUser = await userService.createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        status: "Active",
      });

      await authService.sendEmailVerificationLink(req.body.email);

      res.status(201).json(newUser);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Update the user with the specified userId */
userRouter.put(
  "/:userId",
  isAuthorizedByRole(new Set(["Administrator"])),
  updateUserDtoValidator,
  async (req, res) => {
    try {
      const updatedUser = await userService.updateUserById(req.params.userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        status: "Active",
      });
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Delete a user by userId or email, specified through a query parameter */
userRouter.delete(
  "/",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    const { userId, email } = req.query;

    if (userId && email) {
      res
        .status(400)
        .json({ error: "Cannot delete by both userId and email." });
      return;
    }

    if (userId) {
      if (typeof userId !== "string") {
        res
          .status(400)
          .json({ error: "userId query parameter must be a string." });
      } else {
        try {
          await userService.deleteUserById(userId);
          res.status(204).send();
        } catch (error: unknown) {
          res.status(500).json({ error: getErrorMessage(error) });
        }
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
          await userService.deleteUserByEmail(email);
          res.status(204).send();
        } catch (error: unknown) {
          res.status(500).json({ error: getErrorMessage(error) });
        }
      }
      return;
    }

    res.status(400).json({
      error: "Must supply one of userId or email as query parameter.",
    });
  },
);

userRouter.get(
  "/:role",
  isAuthorizedByRole(new Set(["Administrator"])),
  async (req, res) => {
    try {
      const captializedRole = capitalizeFirstLetter(req.params.role);
      if (isRole(captializedRole)) {
        const users = await userService.getUsersByRole(captializedRole);
        res.status(200).json(users);
      } else {
        res.status(400).json({ error: `Invalid role` });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Facilitator will be able to view a list of all their learners */
userRouter.get(
  "/facilitator/myLearners",
  isAuthorizedByRole(new Set(["Facilitator"])),
  async (req, res) => {
    const accessToken = getAccessToken(req);
    try {
      if (!accessToken) {
        throw new Error("Unauthorized: No access token provided");
      }
      const facilitatorId = await authService.getUserIdFromAccessToken(
        accessToken,
      );
      const facilitator = await userService.getUserById(
        facilitatorId.toString(),
      );

      if (isFacilitator(facilitator)) {
        const learners = await Promise.all(
          facilitator.learners.map(async (learnerId) => {
            const learner = await userService.getUserById(learnerId.toString());
            return learner;
          }),
        );
        res.status(200).json(learners);
      } else {
        throw new Error("Unathorized: User retrieved is not a facilitator.");
      }
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

/* Facilitator will be able to edit their learners */
userRouter.put(
  "/facilitator/myLearners/:userId",
  isAuthorizedByRole(new Set(["Facilitator"])),
  updateUserDtoValidator,
  async (req, res) => {
    const accessToken = getAccessToken(req);
    try {
      if (!accessToken) {
        throw new Error("Unauthorized: No access token provided");
      }

      const facilitatorId = await authService.getUserIdFromAccessToken(
        accessToken,
      );
      const selectedLearnerId = req.params.userId;
      const facilitator = await userService.getUserById(
        facilitatorId.toString(),
      );

      if (isFacilitator(facilitator)) {
        // verify that selected learner userId corresponds to learner belonging to facilitator

        // facilitator.learners is an array of ObjectIds
        // FacilitatorDTO casts it as an array of strings
        const facilitatorHasLearner = facilitator.learners.find(
          (learnerId) => learnerId.toString() === selectedLearnerId,
        );

        if (!facilitatorHasLearner) {
          throw new Error(
            "Unauthorized: Learner does not belong to facilitator.",
          );
        }
      } else {
        throw new Error("Unauthorized: User retrieved is not a facilitator.");
      }

      const oldLearner: UserDTO = await userService.getUserById(
        selectedLearnerId,
      );
      // update learner
      const updateLearnerPayload: UpdateUserDTO = {
        ...oldLearner,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      const updatedUser = await userService.updateUserById(
        selectedLearnerId,
        updateLearnerPayload,
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(getErrorMessage(error));
    }
  },
);

userRouter.put(
  "/learner/markActivityCompleted",
  isAuthorizedByRole(new Set(["Learner"])),
  completeActivityValidator,
  async (req, res) => {
    const accessToken = getAccessToken(req)!;
    try {
      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const learner = await userService.getUserById(learnerId.toString());

      if (!isLearner(learner)) {
        return res.status(403).send("Forbidden: User is not a learner.");
      }

      const { unitId, moduleId, activityId } = req.body;

      // Check that everything exists
      const courseUnit = await courseUnitService.getCourseUnit(unitId);

      if (!courseUnit) {
        return res.status(400).send("The unit provided does not exist.");
      }

      if (!courseUnit.modules.includes(moduleId)) {
        return res
          .status(400)
          .send(`The module provided does not exist on unit ${unitId}.`);
      }

      const courseModule = (await courseModuleService.getCourseModule(
        moduleId,
      ))!;

      if (
        !courseModule.pages.some(
          (page) => page.id === activityId && page.type === "Activity",
        )
      ) {
        return res
          .status(400)
          .send(
            `The activity provided does not exist on module ${moduleId} or is not an activity.`,
          );
      }

      const updatedUser = (await userService.addActivityToProgress(
        learnerId.toString(),
        unitId,
        moduleId,
        activityId,
      ))!;
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).send(getErrorMessage(error));
    }
  },
);

userRouter.get(
  "/learner/progress",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req, res) => {
    const accessToken = getAccessToken(req)!;
    try {
      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const learner = await userService.getUserById(learnerId.toString());

      if (!isLearner(learner)) {
        return res.status(403).send("Forbidden: User is not a learner.");
      }

      const completedModules = await userService.getCompletedModules(learner);
      const allUnits = await courseUnitService.getCourseUnits();
      const numModules = allUnits.reduce(
        (acc, unit) => acc + unit.modules.length,
        0,
      );

      return res.status(200).send({
        completedModules,
        numModules,
      });
    } catch (error) {
      return res.status(500).send(getErrorMessage(error));
    }
  },
);

userRouter.put(
  "/learner/viewedPage",
  isAuthorizedByRole(new Set(["Learner"])),
  async (req, res) => {
    const accessToken = getAccessToken(req)!;
    try {
      const learnerId = await authService.getUserIdFromAccessToken(accessToken);
      const learner = await userService.getUserById(learnerId.toString());

      if (!isLearner(learner)) {
        return res.status(403).send("Forbidden: User is not a learner.");
      }

      const { unitId, moduleId, pageId } = req.body;

      const updatedUser = await userService.updateNextPage(
        learnerId.toString(),
        {
          unitId,
          moduleId,
          pageId,
        },
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).send(getErrorMessage(error));
    }
  },
);

export default userRouter;
