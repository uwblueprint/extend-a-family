import * as firebaseAdmin from "firebase-admin";
import mongoose, { Model, ObjectId } from "mongoose";
import IUserService from "../interfaces/userService";
import MgUser, {
  Learner,
  User,
  LearnerModel,
  FacilitatorModel,
} from "../../models/user.mgmodel";
import {
  CreateUserDTO,
  LearnerDTO,
  Role,
  Status,
  UpdateUserDTO,
  UserDTO,
} from "../../types/userTypes";
import { AuthErrorCodes } from "../../types/authTypes";
import { getErrorCode, getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import EmailService from "./emailService";
import IEmailService from "../interfaces/emailService";
import nodemailerConfig from "../../nodemailer.config";
import facilitatorRejectedEmail from "../../emails/facilitatorRejected";
import facilitatorApprovedEmail from "../../emails/facilitatorApproved";

const Logger = logger(__filename);
const emailService: IEmailService = new EmailService(nodemailerConfig);

const getMongoUserByAuthId = async (authId: string): Promise<User> => {
  const user: User | null = await MgUser.findOne({ authId });
  if (!user) {
    throw new Error(`user with authId ${authId} not found.`);
  }
  return user;
};

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */
  async getUserById(userId: string | ObjectId): Promise<UserDTO> {
    let user: User | null;
    try {
      user = await MgUser.findById(userId).populate({
        path: "facilitator",
        select: "firstName lastName email bio profilePicture",
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return user.toObject();
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user: User | null;

    try {
      user = await MgUser.findOne({ email });
      if (!user) {
        throw new Error(`user with email ${email} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw new Error(AuthErrorCodes.EMAIL_NOT_FOUND);
    }

    return user.toObject();
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const { role } = await getMongoUserByAuthId(authId);
      return role;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<ObjectId> {
    try {
      const { id } = await getMongoUserByAuthId(authId);
      return id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await MgUser.findById(userId);
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];

    try {
      const users: Array<User> = await MgUser.find();

      userDtos = await Promise.all(users.map(async (user) => user.toObject()));
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(user: CreateUserDTO): Promise<UserDTO> {
    let newUser: User;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });

      try {
        newUser = await MgUser.create({
          firstName: user.firstName,
          lastName: user.lastName,
          authId: firebaseUser.uid,
          role: user.role,
          status: user.status,
          email: user.email,
          bookmarks: [],
        });
      } catch (mongoDbError) {
        // rollback user creation in Firebase
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after MongoDB user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      const errorCode = getErrorCode(error);

      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);

      switch (errorCode) {
        case "auth/email-already-exists":
          throw new Error(AuthErrorCodes.EMAIL_IN_USE);
        case "auth/invalid-email":
          throw new Error(AuthErrorCodes.INVALID_EMAIL);
        default:
          throw error;
      }
    }

    return newUser.toObject();
  }

  async createLearner(
    user: CreateUserDTO,
    facilitatorId: string,
  ): Promise<LearnerDTO> {
    let newLearner: Learner;
    let firebaseUser: firebaseAdmin.auth.UserRecord;
    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });
      try {
        newLearner = await LearnerModel.create({
          ...user,
          authId: firebaseUser.uid,
          facilitator: facilitatorId,
        });
        await FacilitatorModel.findByIdAndUpdate(
          facilitatorId,
          { $push: { learners: newLearner.id } },
          { runValidators: true },
        );
      } catch (mongoError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after MongoDB user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }
        throw mongoError;
      }
    } catch (err: unknown) {
      Logger.error(
        `Failed to create learner. Reason = ${getErrorMessage(err)}`,
      );
      throw err;
    }

    return newLearner.toObject();
  }

  async updateUserById(
    userId: ObjectId | string,
    user: UpdateUserDTO,
  ): Promise<UserDTO> {
    try {
      const MgUserDiscriminator = MgUser.discriminators?.[
        user.role
      ] as Model<User>;

      const updatedUser: User | null =
        await MgUserDiscriminator.findByIdAndUpdate(userId, user, {
          runValidators: true,
          new: true,
        });

      if (!updatedUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      return updatedUser.toObject();
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser: User | null = await MgUser.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in MongoDB
        const { id, ...rest } = deletedUser.toObject();
        try {
          await MgUser.create(rest);
        } catch (mongoDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(mongoDbError),
            "Firebase uid with non-existent MongoDB record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await MgUser.findOneAndDelete({
        authId: firebaseUser.uid,
      });

      if (!deletedUser) {
        throw new Error(`authId (Firebase uid) ${firebaseUser.uid} not found.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
      } catch (error) {
        // rollback user deletion in MongoDB
        const { id, ...rest } = deletedUser.toObject();
        try {
          await MgUser.create(rest);
        } catch (mongoDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(mongoDbError),
            "Firebase uid with non-existent MongoDB record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsersByRole(role: Role): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users: Array<User> = await MgUser.find({ role });

      userDtos = await Promise.all(users.map(async (user) => user.toObject()));
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
    return userDtos;
  }

  async isFirstTimeInvitedUser(accessToken: string): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      const { status } = await getMongoUserByAuthId(decodedIdToken.uid);
      return status === "Invited";
    } catch (error: unknown) {
      Logger.error(
        `Failed to verify user is first time invited user. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async changeUserStatus(
    accessToken: string,
    newStatus: Status,
  ): Promise<void> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken =
        await firebaseAdmin.auth().verifyIdToken(accessToken, true);
      const tokenUserId = await this.getUserIdByAuthId(decodedIdToken.uid);
      const currentUser = await this.getUserById(tokenUserId);
      const updatedUser: UpdateUserDTO = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
        status: newStatus,
        profilePicture: currentUser.profilePicture,
      };
      await this.updateUserById(tokenUserId, updatedUser);
    } catch (error: unknown) {
      Logger.error(
        `Failed to change user status. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async approveFacilitator(userId: string): Promise<UserDTO> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await FacilitatorModel.findByIdAndUpdate(
        userId,
        { approved: true, status: "Active" },
        { new: true, runValidators: true, session },
      );

      if (!user) {
        throw new Error("User not found");
      }

      Logger.info(`Facilitator ${userId} has been approved`);

      await emailService.sendEmail(
        user.email,
        "Facilitator Account Approved",
        facilitatorApprovedEmail(),
      );

      await session.commitTransaction();

      return user.toObject() as unknown as UserDTO;
    } catch (error: unknown) {
      await session.abortTransaction();
      Logger.error(
        `Failed to approve facilitator. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }

  async rejectFacilitator(userId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await MgUser.findById(userId, null, { session });
      if (!user) {
        throw new Error("User not found");
      }

      // Delete from Firebase first
      try {
        await firebaseAdmin.auth().deleteUser(user.authId);
      } catch (firebaseError: unknown) {
        Logger.error(
          `Failed to delete Firebase user: ${getErrorMessage(firebaseError)}`,
        );
        throw firebaseError;
      }

      // Then delete from MongoDB
      await MgUser.findByIdAndDelete(userId, { session });

      Logger.info(`Facilitator ${userId} has been rejected and deleted`);

      await emailService.sendEmail(
        user.email,
        "Facilitator Application Status",
        facilitatorRejectedEmail(),
      );
      await session.commitTransaction();
    } catch (error: unknown) {
      await session.abortTransaction();
      Logger.error(
        `Failed to reject facilitator. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default UserService;
