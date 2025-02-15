import { ObjectId } from "mongoose";
import {
  CreateUserDTO,
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
}

export default IUserService;
