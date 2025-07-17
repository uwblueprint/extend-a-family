import { QuestionType } from "../../types/activityTypes";
import { Activity } from "../../models/activity.mgmodel";

interface IActivityService {
  /**
   * Creates a new activity of the specified question type and adds it to the module.
   * @param moduleId The ID of the course module.
   * @param questionType The type of question/activity to create.
   * @param index Optional index to insert the activity at a specific position.
   * @returns An object containing the updated list of page IDs.
   * @throws Error if creation fails.
   */
  createActivity(
    moduleId: string,
    questionType: QuestionType,
    index?: number,
  ): Promise<{ pages: string[] }>;

  /**
   * Deletes an activity and removes it from the module.
   * @param moduleId The ID of the course module.
   * @param activityId The ID of the activity to delete.
   * @returns An object containing the updated list of page IDs.
   * @throws Error if deletion fails.
   */
  deleteActivity(
    moduleId: string,
    activityId: string,
  ): Promise<{ pages: string[] }>;

  /**
   * Retrieves an activity by its ID.
   * @param activityId The ID of the activity.
   * @returns The activity object.
   * @throws Error if not found.
   */
  getActivity(activityId: string): Promise<Activity>;

  /**
   * Updates an activity with the provided fields.
   * @param activityId The ID of the activity.
   * @param update The fields to update.
   * @returns The updated activity object.
   * @throws Error if not found or update fails.
   */
  updateActivity(
    activityId: string,
    update: Partial<Activity>,
  ): Promise<Activity>;
}

export default IActivityService;
