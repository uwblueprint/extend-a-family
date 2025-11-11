import { ObjectId } from "mongoose";
import IFeedbackService from "../interfaces/feedbackService";
import MgFeedback from "../../models/feedback.mgmodel";
import { FeedbackDTO, CreateFeedbackDTO } from "../../types/feedbackTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

import MgUser, { User } from "../../models/user.mgmodel";
import MgCourseUnit, { CourseUnit } from "../../models/courseunit.mgmodel";
import MgCourseModule, {
  CourseModule,
} from "../../models/coursemodule.mgmodel";

const Logger = logger(__filename);

class FeedbackService implements IFeedbackService {
  /* eslint-disable class-methods-use-this */
  async getFeedbackById(feedbackId: string | ObjectId): Promise<FeedbackDTO> {
    try {
      const feedback: FeedbackDTO | null = await MgFeedback.findById(
        feedbackId,
      );
      if (!feedback) {
        throw new Error(`Feedback with id ${feedbackId} not found`);
      }
      return feedback;
    } catch (error) {
      Logger.error(`Error getting feedback by id: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createFeedback(feedback: CreateFeedbackDTO): Promise<FeedbackDTO> {
    let newFeedback: FeedbackDTO;

    try {
      const learnerObject: User | null = await MgUser.findById(
        feedback.learnerId,
      );
      const moduleObject: CourseModule | null = await MgCourseModule.findById(
        feedback.moduleId,
      );
      const unitObject: CourseUnit | null = await MgCourseUnit.findById(
        feedback.unitId,
      );

      if (!learnerObject) {
        throw new Error(`Learner with id ${feedback.learnerId} not found`);
      }
      if (!moduleObject) {
        throw new Error(`Module with id ${feedback.moduleId} not found`);
      }
      if (!unitObject) {
        throw new Error(`Unit with id ${feedback.unitId} not found`);
      }

      newFeedback = await MgFeedback.create({
        learnerId: learnerObject.id,
        moduleId: moduleObject.id,
        unitId: unitObject.id,
        isLiked: feedback.isLiked,
        difficulty: feedback.difficulty,
        message: feedback.message,
      });
      return {
        id: newFeedback.id,
        learnerId: newFeedback.learnerId,
        moduleId: newFeedback.moduleId,
        unitId: newFeedback.unitId,
        isLiked: newFeedback.isLiked,
        difficulty: newFeedback.difficulty,
        message: newFeedback.message,
      };
    } catch (error) {
      Logger.error(`Error creating feedback: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAllFeedback(): Promise<FeedbackDTO[]> {
    try {
      const allFeedback = await MgFeedback.find();
      if (allFeedback.length === 0) {
        throw new Error(`Feedback not found`);
      }
      return allFeedback;
    } catch (error) {
      Logger.error(`Error getting all feedback: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
export default FeedbackService;
