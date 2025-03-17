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
}

export default IFeedbackService;
