import mongoose, { ObjectId } from "mongoose";
import { Activity } from "../../models/activity.mgmodel";
import CourseModuleModel from "../../models/coursemodule.mgmodel";
import { Media, QuestionType } from "../../types/activityTypes";
import { CourseModuleDTO } from "../../types/courseTypes";
import { activityModelMapper } from "../../utilities/activityModelMapper";

class ActivityService {
  static async createActivity(
    moduleId: string,
    questionType: QuestionType,
    index?: number,
    activityData?: Partial<Activity>,
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
        title: "New Activity",
        activityNumber: "1",
        questionText: "Enter your question here",
        instruction: "Please select the correct answer",
      };

      let activityDataToCreate;
      if (questionType === QuestionType.MultipleChoice) {
        activityDataToCreate = {
          ...baseActivity,
          correctAnswer: 0,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          ...activityData,
        };
      } else if (questionType === QuestionType.MultiSelect) {
        activityDataToCreate = {
          ...baseActivity,
          correctAnswers: [0],
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          ...activityData,
        };
      } else if (questionType === QuestionType.Table) {
        activityDataToCreate = {
          ...baseActivity,
          columnLabels: ["Header", "Header", "Header", "Header", "Header"],
          rowLabels: [["Row 1"], ["Row 2"], ["Row 3"], ["Row 4"], ["Row 5"]],
          correctAnswers: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
          ],
          headerColumnIncludes: "image_and_text",
          ...activityData,
        };
      } else if (questionType === QuestionType.Matching) {
        const media: Media[] = [
          { id: "1", mediaType: "text", context: "" },
          { id: "2", mediaType: "text", context: "" },
          { id: "3", mediaType: "text", context: "" },
          { id: "4", mediaType: "text", context: "" },
          { id: "5", mediaType: "text", context: "" },
          { id: "6", mediaType: "text", context: "" },
          { id: "7", mediaType: "text", context: "" },
          { id: "8", mediaType: "text", context: "" },
          { id: "9", mediaType: "text", context: "" },
        ];
        activityDataToCreate = {
          ...baseActivity,
          media: {
            "1": [media[0], media[1], media[2]],
            "2": [media[3], media[4], media[5]],
            "3": [media[6], media[7], media[8]],
          },
          correctAnswers: [
            ["1", "4", "7"],
            ["2", "5", "8"],
            ["3", "6", "9"],
          ],
          rows: 3,
          ...activityData,
        };
      } else if (questionType === QuestionType.TextInput) {
        activityDataToCreate = {
          ...baseActivity,
          placeholder: "Enter your answer here",
          maxLength: 200,
          validation: {
            mode: "short_answer",
            answers: [],
          },
          ...activityData,
        };
      } else {
        activityDataToCreate = {
          ...baseActivity,
          ...activityData,
        };
      }

      const activityDocs = await (Model as typeof mongoose.Model).create(
        [activityDataToCreate],
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
      )
        .populate("pages")
        .lean()
        .exec();

      if (!updatedModule) {
        throw new Error("Module not found");
      }

      await session.commitTransaction();
      return {
        pages: updatedModule.pages.map((page: CourseModuleDTO["pages"][number] | ObjectId | string) => {
          if (typeof page === "string") return page;
          if (page instanceof mongoose.Types.ObjectId) return page.toString();
          if ("id" in page && page.id) return page.id;
          if ("_id" in page && page._id) return page._id.toString();
          return String(page);
        }),
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
  ): Promise<Activity> {
    const Model =
      activityModelMapper[questionType as keyof typeof activityModelMapper];
    if (!Model) {
      throw new Error("Unsupported question type");
    }
    const updated = await (Model as typeof mongoose.Model)
      .findByIdAndUpdate(activityId, update, {
        new: true,
        validateModifiedOnly: true,
      })
      .lean();
    if (!updated) {
      throw new Error("Activity not found");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return updated as any as Activity;
  }
}

export default ActivityService;
