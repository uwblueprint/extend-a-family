import { FeedbackDTO, CreateFeedbackDTO } from "../../types/feedbackTypes";

interface IFeedbackService {
  /**
   * Get feedback associated with id
   * @param feedbackId feedback's id
   * @returns feedback with feedback's information
   * @throws Error if feedback retrieval fails
   */
  getFeedbackById(feedbackId: string): Promise<FeedbackDTO>;

  /**
   * Create a feedback
   * @param feedback the feedback to be created
   * @returns the created feedback
   * @throws Error if feedback creation fails
   */
  createFeedback(feedback: CreateFeedbackDTO): Promise<FeedbackDTO>;

  /**
   * @returns all feedback that exist
   * @throws error if feedback retrieval fails
   */
  getAllFeedback(): Promise<FeedbackDTO[]>;

  /**
   * Check if a learner has already submitted feedback for a module
   * @param learnerId learner's id
   * @param moduleId module's id
   * @returns true if feedback exists, false otherwise
   * @throws Error if check fails
   */
  hasFeedback(learnerId: string, moduleId: string): Promise<boolean>;
}

export default IFeedbackService;
