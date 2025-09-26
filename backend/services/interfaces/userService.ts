import { ObjectId } from "mongoose";
import { Learner } from "../../models/user.mgmodel";
import {
  CreateUserDTO,
  LearnerDTO,
  Role,
  Status,
  UpdateUserDTO,
  UserDTO,
} from "../../types/userTypes";

interface IUserService {
  /**
   * Get user associated with id
   * @param id user's id
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserById(userId: string): Promise<UserDTO>;

  /**
   * Get user associated with email
   * @param email user's email
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserByEmail(email: string): Promise<UserDTO>;

  /**
   * Get role of user associated with authId
   * @param authId user's authId
   * @returns role of the user
   * @throws Error if user role retrieval fails
   */
  getUserRoleByAuthId(authId: string): Promise<Role>;

  /**
   * Get id of user associated with authId
   * @param authId user's authId
   * @returns id of the user
   * @throws Error if user id retrieval fails
   */
  getUserIdByAuthId(authId: string): Promise<ObjectId>;

  /**
   * Get authId of user associated with id
   * @param userId user's id
   * @returns user's authId
   * @throws Error if user authId retrieval fails
   */
  getAuthIdById(userId: string): Promise<string>;

  /**
   * Get all user information (possibly paginated in the future)
   * @returns array of UserDTOs
   * @throws Error if user retrieval fails
   */
  getUsers(): Promise<Array<UserDTO>>;

  /**
   * Create a user, email verification configurable
   * @param user the user to be created
   * @param authId the user's firebase auth id, optional
   * @param signupMethod the method user used to signup
   * @returns a UserDTO with the created user's information
   * @throws Error if user creation fails
   */
  createUser(user: CreateUserDTO, authId?: string): Promise<UserDTO>;

  /**
   * Create a learner, link them to their facilitator, and add them to their facilitator's learner list
   * @param user the user to be created
   * @param facilitatorId the auth ID of the facilitator to link the new learner to
   * @returns a UserDTO with the created learner's information
   * @throws Error if user creation fails
   */
  createLearner(user: CreateUserDTO, facilitatorId: string): Promise<UserDTO>;

  /**
   * Update a user.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param user the user to be updated
   * @returns a UserDTO with the updated user's information
   * @throws Error if user update fails
   */
  updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO>;

  /**
   * Delete a user by id
   * @param userId user's userId
   * @throws Error if user deletion fails
   */
  deleteUserById(userId: string): Promise<void>;

  /**
   * Delete a user by email
   * @param email user's email
   * @throws Error if user deletion fails
   */
  deleteUserByEmail(email: string): Promise<void>;

  /**
   * Gets all user that belong to the role
   * @param role the role that we want to get
   * @returns an Array of UserDtos that all have the corresponding role
   */
  getUsersByRole(role: Role): Promise<Array<UserDTO>>;

  /**
   * Determine if the provided access token is valid and the user to which it belongs has the specified status
   * @param accessToken user's access token
   * @param status status to check for match
   */
  isFirstTimeInvitedUser(accessToken: string): Promise<boolean>;

  /**
   * Update the user's status to the specified new status value
   * @param accessToken user's access token
   * @param newStatus status to update to
   */
  changeUserStatus(accessToken: string, newStatus: Status): Promise<void>;

  /**
   * Add an activity to a learner's progress
   * @param learnerId the id of the learner to add the activity to
   * @param unitId the id of the unit to add the activity to
   * @param moduleId the id of the module to add the activity to
   * @param activityId the id of the activity to add to the learner's progress
   * @returns the updated learner
   */
  addActivityToProgress(
    learnerId: string,
    unitId: string,
    moduleId: string,
    activityId: string,
  ): Promise<Learner | null>;

  /**
   * Get the set of completed modules for a learner
   * @param learner the learner to get the set of completed modules for
   * @returns the set of completed modules
   */
  getCompletedModules(learner: LearnerDTO): Promise<Set<string>>;

  /**
   * Delete an activity from every learner's progress
   * @param unitId the unit id of the activity to delete
   * @param moduleId the module id of the activity to delete
   * @param activityId the activity id of the activity to delete
   * @returns the number of learners that were updated
   */
  deleteActivityFromProgress(
    unitId: string,
    moduleId: string,
    activityId: string,
  ): Promise<number>;

  /**
   * Update the next page for a learner
   * @param learnerId the id of the learner to update the next page for
   * @param justViewed information about the page that the learner just viewed
   * @returns the updated learner
   */
  updateNextPage(
    learnerId: string,
    justViewed: { unitId: string; moduleId: string; pageId: string },
  ): Promise<Learner | null>;
}
export default IUserService;
