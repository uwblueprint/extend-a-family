import {
  CourseProgressDTO,
  LearnerProgressDTO,
  ModuleProgressDTO,
  UpdateLastViewedPageDTO,
} from "../../types/progressTypes";

/**
 * Service interface for managing learner progress through course content.
 */
interface ILearnerProgressService {
  /**
   * Gets or creates a progress record for a learner.
   * @param learnerId the learner's user ID
   * @returns The learner's progress record
   */
  getOrCreateProgress(learnerId: string): Promise<LearnerProgressDTO>;

  /**
   * Marks an activity as completed for a learner.
   * Will also check if the module is now complete and update module completion.
   * @param learnerId the learner's user ID
   * @param activityId the ID of the completed activity
   * @param moduleId the ID of the module containing the activity
   * @returns Updated progress record with module completion status
   */
  completeActivity(
    learnerId: string,
    activityId: string,
    moduleId: string,
  ): Promise<{
    progress: LearnerProgressDTO;
    moduleProgress: ModuleProgressDTO;
  }>;

  /**
   * Checks if a specific activity is completed by a learner.
   * @param learnerId the learner's user ID
   * @param activityId the ID of the activity to check
   * @returns true if the activity is completed, false otherwise
   */
  isActivityCompleted(learnerId: string, activityId: string): Promise<boolean>;

  /**
   * Gets progress information for a specific module.
   * Only considers activities in published modules.
   * @param learnerId the learner's user ID
   * @param moduleId the ID of the module
   * @returns Progress information for the module
   */
  getModuleProgress(
    learnerId: string,
    moduleId: string,
  ): Promise<ModuleProgressDTO>;

  /**
   * Gets overall course progress for a learner.
   * Only considers activities in published modules.
   * @param learnerId the learner's user ID
   * @returns Overall course progress statistics
   */
  getCourseProgress(learnerId: string): Promise<CourseProgressDTO>;

  /**
   * Updates the last viewed page for a learner.
   * @param learnerId the learner's user ID
   * @param lastViewedPage the module and page IDs to record
   * @returns Updated progress record
   */
  updateLastViewedPage(
    learnerId: string,
    lastViewedPage: UpdateLastViewedPageDTO,
  ): Promise<LearnerProgressDTO>;

  /**
   * Gets the last viewed page for a learner.
   * @param learnerId the learner's user ID
   * @returns The last viewed page info, or null if none
   */
  getLastViewedPage(learnerId: string): Promise<UpdateLastViewedPageDTO | null>;

  /**
   * Gets course progress for multiple learners (for facilitator view).
   * @param learnerIds array of learner user IDs
   * @returns Map of learner ID to their course progress
   */
  getCourseProgressForLearners(
    learnerIds: string[],
  ): Promise<Map<string, CourseProgressDTO>>;
}

export default ILearnerProgressService;
