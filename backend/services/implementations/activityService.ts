import mongoose, { ObjectId } from "mongoose";
import { QuestionType } from "../../types/activityTypes";
import CourseModuleModel from "../../models/coursemodule.mgmodel";
import { Activity } from "../../models/activity.mgmodel";
import { activityModelMapper } from "../../utilities/activityModelMapper";
import { IActivityService } from "../../interfaces/IActivityService";

class ActivityService implements IActivityService {
  static async createActivity(
    moduleId: string,
    questionType: QuestionType,
    index?: number,
  ): Promise<{ pages: string[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const Model =
        activityModelMapper[questionType as keyof typeof activityModelMapper];
      if (!Model) {
        throw new Error("Unsupported question type");
      }

      const baseActivity = {
        questionType,
        activityNumber: "",
        questionText: "",
        instruction: "",
        options: [],
      };

      let activityData;
      if (questionType === QuestionType.MultipleChoice) {
        activityData = { ...baseActivity, correctOption: "" };
      } else if (questionType === QuestionType.MultiSelect) {
        activityData = { ...baseActivity, correctAnswers: [] };
      } else {
        activityData = baseActivity;
      }

      const activityDocs = await (Model as typeof mongoose.Model).create(
        [activityData],
        { session },
      );
      const activity = activityDocs[0];

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
    questionType: QuestionType,
  ): Promise<{ pages: string[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const Model =
        activityModelMapper[questionType as keyof typeof activityModelMapper];
      if (!Model) {
        throw new Error("Unsupported question type");
      }

      await (Model as typeof mongoose.Model).findByIdAndDelete(activityId, {
        session,
      });

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

  static async getActivity(
    activityId: string,
    questionType: QuestionType,
  ): Promise<Activity | null> {
    const Model =
      activityModelMapper[questionType as keyof typeof activityModelMapper];
    if (!Model) {
      throw new Error("Unsupported question type");
    }
    const activity = await (Model as typeof mongoose.Model)
      .findById(activityId)
      .lean();
    if (!activity) {
      throw new Error("Activity not found");
    }
    return activity as unknown as Activity;
  }

  static async updateActivity(
    activityId: string,
    questionType: QuestionType,
    update: Partial<Activity>,
  ) {
    const Model =
      activityModelMapper[questionType as keyof typeof activityModelMapper];
    if (!Model) {
      throw new Error("Unsupported question type");
    }
    const updated = await (Model as typeof mongoose.Model)
      .findByIdAndUpdate(activityId, update, {
        new: true,
        runValidators: true,
      })
      .lean();
    if (!updated) {
      throw new Error("Activity not found");
    }
    return updated;
  }
}

export default ActivityService;
