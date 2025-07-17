import mongoose, { ObjectId } from "mongoose";
import CourseModuleModel from "../../models/coursemodule.mgmodel";
import ActivityModel, {
  Activity,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
} from "../../models/activity.mgmodel";
import { QuestionType } from "../../types/activityTypes";

class ActivityService {
  static async createActivity(
    moduleId: string,
    questionType: QuestionType,
    index?: number,
  ): Promise<{ pages: string[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let activity;
      switch (questionType) {
        case QuestionType.MultipleChoice:
          [activity] = await MultipleChoiceActivityModel.create(
            [
              {
                questionType,
                activityNumber: "",
                questionText: "",
                instruction: "",
                options: [],
                correctOption: "",
              },
            ],
            { session },
          );
          break;
        case QuestionType.MultiSelect:
          [activity] = await MultiSelectActivityModel.create(
            [
              {
                questionType,
                activityNumber: "",
                questionText: "",
                instruction: "",
                options: [],
                correctAnswers: [],
              },
            ],
            { session },
          );
          break;
        default:
          throw new Error("Unsupported question type");
      }

      const pushOp =
        typeof index === "number"
          ? { $each: [activity.id], $position: index }
          : activity.id;

      const updatedModule = await CourseModuleModel.findByIdAndUpdate(
        moduleId,
        { $push: { pages: pushOp } },
        { new: true, session },
      ).lean();

      if (!updatedModule) {
        throw new Error("Module not found");
      }

      await session.commitTransaction();
      return {
        pages: updatedModule.pages.map((id: ObjectId) => id.toString()),
      };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  static async deleteActivity(
    moduleId: string,
    activityId: string,
  ): Promise<{ pages: string[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await ActivityModel.findByIdAndDelete(activityId, { session });

      const updatedModule = await CourseModuleModel.findByIdAndUpdate(
        moduleId,
        { $pull: { pages: activityId } },
        { new: true, session },
      ).lean();

      if (!updatedModule) {
        throw new Error("Module not found");
      }

      await session.commitTransaction();
      return {
        pages: updatedModule.pages.map((id: ObjectId) => id.toString()),
      };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  static async getActivity(activityId: string) {
    const activity = await ActivityModel.findById(activityId).lean();
    if (!activity) {
      throw new Error("Activity not found");
    }
    return activity;
  }

  static async updateActivity(activityId: string, update: Partial<Activity>) {
    const updated = await ActivityModel.findByIdAndUpdate(activityId, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      throw new Error("Activity not found");
    }
    return updated;
  }
}

export default ActivityService;
