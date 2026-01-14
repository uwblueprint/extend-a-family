/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import LearnerProgressModel, {
  LearnerProgress,
} from "../../models/learnerprogress.mgmodel";
import MgCourseModule from "../../models/coursemodule.mgmodel";
import MgCoursePage from "../../models/coursepage.mgmodel";
import {
  CourseProgressDTO,
  LearnerProgressDTO,
  ModuleProgressDTO,
  UpdateLastViewedPageDTO,
} from "../../types/progressTypes";
import { ModuleStatus } from "../../types/courseTypes";
import { QuestionType } from "../../types/activityTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ILearnerProgressService from "../interfaces/learnerProgressService";

const Logger = logger(__filename);

// Activity types that should be tracked for progress
const ACTIVITY_TYPES = Object.values(QuestionType);

class LearnerProgressService implements ILearnerProgressService {
  /**
   * Converts a LearnerProgress document to a DTO.
   */
  private toDTO(progress: LearnerProgress): LearnerProgressDTO {
    const obj = progress.toObject ? progress.toObject() : progress;
    return {
      id: obj.id?.toString() || obj._id?.toString(),
      learnerId: obj.learnerId?.toString(),
      completedActivities:
        obj.completedActivities?.map((id: mongoose.Types.ObjectId) =>
          id.toString(),
        ) || [],
      moduleCompletions:
        obj.moduleCompletions?.map(
          (mc: { moduleId: mongoose.Types.ObjectId; completedAt: Date }) => ({
            moduleId: mc.moduleId.toString(),
            completedAt: mc.completedAt,
          }),
        ) || [],
      lastViewedPage: obj.lastViewedPage
        ? {
            moduleId: obj.lastViewedPage.moduleId.toString(),
            pageId: obj.lastViewedPage.pageId.toString(),
            viewedAt: obj.lastViewedPage.viewedAt,
          }
        : undefined,
    };
  }

  /**
   * Gets all activity IDs in a module (only activities, not lessons).
   */
  private async getModuleActivityIds(moduleId: string): Promise<string[]> {
    const module = await MgCourseModule.findById(moduleId).lean().exec();
    if (!module) {
      return [];
    }

    const pages = await MgCoursePage.find({
      _id: { $in: module.pages },
      type: { $in: ACTIVITY_TYPES },
    })
      .lean()
      .exec();

    return pages.map((page) => page._id.toString());
  }

  /**
   * Gets all published modules in the course.
   */
  private async getPublishedModules(): Promise<
    Array<{ id: string; pages: string[] }>
  > {
    const modules = await MgCourseModule.find({
      status: ModuleStatus.Published,
    })
      .lean()
      .exec();

    return modules.map((m) => ({
      id: m._id.toString(),
      pages: m.pages.map((p) => p.toString()),
    }));
  }

  /**
   * Gets all activity IDs across all published modules.
   */
  private async getAllPublishedActivityIds(): Promise<string[]> {
    const publishedModules = await this.getPublishedModules();
    const allPageIds = publishedModules.flatMap((m) => m.pages);

    const activities = await MgCoursePage.find({
      _id: { $in: allPageIds },
      type: { $in: ACTIVITY_TYPES },
    })
      .lean()
      .exec();

    return activities.map((a) => a._id.toString());
  }

  async getOrCreateProgress(learnerId: string): Promise<LearnerProgressDTO> {
    try {
      let progress = await LearnerProgressModel.findOne({ learnerId });

      if (!progress) {
        progress = await LearnerProgressModel.create({
          learnerId: new mongoose.Types.ObjectId(learnerId),
          completedActivities: [],
          moduleCompletions: [],
        });
      }

      return this.toDTO(progress);
    } catch (error) {
      Logger.error(
        `Failed to get or create progress for learner ${learnerId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async completeActivity(
    learnerId: string,
    activityId: string,
    moduleId: string,
  ): Promise<{
    progress: LearnerProgressDTO;
    moduleProgress: ModuleProgressDTO;
  }> {
    try {
      // Check if module is published
      const module = await MgCourseModule.findById(moduleId).lean().exec();
      if (!module) {
        throw new Error(`Module with id ${moduleId} not found.`);
      }
      if (module.status !== ModuleStatus.Published) {
        throw new Error(
          `Cannot complete activity in non-published module. Module status: ${module.status}`,
        );
      }

      // Add activity to completed list (using $addToSet to avoid duplicates)
      let progress = await LearnerProgressModel.findOneAndUpdate(
        { learnerId },
        {
          $addToSet: {
            completedActivities: new mongoose.Types.ObjectId(activityId),
          },
        },
        { new: true, upsert: true },
      );

      if (!progress) {
        throw new Error(`Failed to update progress for learner ${learnerId}`);
      }

      // Check if module is now complete
      const moduleActivityIds = await this.getModuleActivityIds(moduleId);
      const completedActivitySet = new Set(
        progress.completedActivities.map((id) => id.toString()),
      );
      const completedInModule = moduleActivityIds.filter((id) =>
        completedActivitySet.has(id),
      );

      const isModuleComplete =
        moduleActivityIds.length > 0 &&
        completedInModule.length === moduleActivityIds.length;

      // If module is complete and not already recorded, add completion record
      const alreadyRecorded = progress.moduleCompletions.some(
        (mc) => mc.moduleId.toString() === moduleId,
      );

      if (isModuleComplete && !alreadyRecorded) {
        const updatedProgress = await LearnerProgressModel.findOneAndUpdate(
          { learnerId },
          {
            $push: {
              moduleCompletions: {
                moduleId: new mongoose.Types.ObjectId(moduleId),
                completedAt: new Date(),
              },
            },
          },
          { new: true },
        );
        if (updatedProgress) {
          progress = updatedProgress;
        }
      }

      const moduleProgress: ModuleProgressDTO = {
        totalActivities: moduleActivityIds.length,
        completedActivities: completedInModule.length,
        progressPercentage:
          moduleActivityIds.length > 0
            ? Math.round(
                (completedInModule.length / moduleActivityIds.length) * 100,
              )
            : 100,
        isCompleted: isModuleComplete,
        completedAt: progress.moduleCompletions.find(
          (mc) => mc.moduleId.toString() === moduleId,
        )?.completedAt,
      };

      return {
        progress: this.toDTO(progress),
        moduleProgress,
      };
    } catch (error) {
      Logger.error(
        `Failed to complete activity ${activityId} for learner ${learnerId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async isActivityCompleted(
    learnerId: string,
    activityId: string,
  ): Promise<boolean> {
    try {
      const progress = await LearnerProgressModel.findOne({ learnerId })
        .lean()
        .exec();

      if (!progress) {
        return false;
      }

      return progress.completedActivities.some(
        (id) => id.toString() === activityId,
      );
    } catch (error) {
      Logger.error(
        `Failed to check activity completion for learner ${learnerId}, activity ${activityId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getModuleProgress(
    learnerId: string,
    moduleId: string,
  ): Promise<ModuleProgressDTO> {
    try {
      // Check if module is published
      const module = await MgCourseModule.findById(moduleId).lean().exec();
      if (!module) {
        throw new Error(`Module with id ${moduleId} not found.`);
      }

      // If module is not published, return empty progress
      if (module.status !== ModuleStatus.Published) {
        return {
          totalActivities: 0,
          completedActivities: 0,
          progressPercentage: 0,
          isCompleted: false,
        };
      }

      const progress = await LearnerProgressModel.findOne({ learnerId })
        .lean()
        .exec();

      const moduleActivityIds = await this.getModuleActivityIds(moduleId);
      const completedActivitySet = new Set(
        progress?.completedActivities?.map((id) => id.toString()) || [],
      );

      const completedInModule = moduleActivityIds.filter((id) =>
        completedActivitySet.has(id),
      );

      const moduleCompletion = progress?.moduleCompletions?.find(
        (mc) => mc.moduleId.toString() === moduleId,
      );

      const isCompleted =
        moduleActivityIds.length > 0 &&
        completedInModule.length === moduleActivityIds.length;

      return {
        totalActivities: moduleActivityIds.length,
        completedActivities: completedInModule.length,
        progressPercentage:
          moduleActivityIds.length > 0
            ? Math.round(
                (completedInModule.length / moduleActivityIds.length) * 100,
              )
            : 100,
        isCompleted,
        completedAt: moduleCompletion?.completedAt,
      };
    } catch (error) {
      Logger.error(
        `Failed to get module progress for learner ${learnerId}, module ${moduleId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getCourseProgress(learnerId: string): Promise<CourseProgressDTO> {
    try {
      const progress = await LearnerProgressModel.findOne({ learnerId })
        .lean()
        .exec();

      // Get all activity IDs from published modules only
      const allActivityIds = await this.getAllPublishedActivityIds();
      const publishedModules = await this.getPublishedModules();

      const completedActivitySet = new Set(
        progress?.completedActivities?.map((id) => id.toString()) || [],
      );

      // Only count completed activities that are in published modules
      const completedInPublished = allActivityIds.filter((id) =>
        completedActivitySet.has(id),
      );

      // Count completed modules (only published ones)
      const completedModuleCount =
        progress?.moduleCompletions?.filter((mc) =>
          publishedModules.some((pm) => pm.id === mc.moduleId.toString()),
        ).length || 0;

      // Calculate progress percentage:
      // If there are no activities in any published modules, consider it 100% complete
      // (modules with no activities are considered completed)
      const progressPercentage =
        allActivityIds.length > 0
          ? Math.round(
              (completedInPublished.length / allActivityIds.length) * 100,
            )
          : publishedModules.length > 0
            ? 100
            : 0;

      return {
        totalActivities: allActivityIds.length,
        completedActivities: completedInPublished.length,
        progressPercentage,
        totalModules: publishedModules.length,
        completedModules: completedModuleCount,
      };
    } catch (error) {
      Logger.error(
        `Failed to get course progress for learner ${learnerId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async updateLastViewedPage(
    learnerId: string,
    lastViewedPage: UpdateLastViewedPageDTO,
  ): Promise<LearnerProgressDTO> {
    try {
      const progress = await LearnerProgressModel.findOneAndUpdate(
        { learnerId },
        {
          $set: {
            lastViewedPage: {
              moduleId: new mongoose.Types.ObjectId(lastViewedPage.moduleId),
              pageId: new mongoose.Types.ObjectId(lastViewedPage.pageId),
              viewedAt: new Date(),
            },
          },
        },
        { new: true, upsert: true },
      );

      return this.toDTO(progress);
    } catch (error) {
      Logger.error(
        `Failed to update last viewed page for learner ${learnerId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getLastViewedPage(
    learnerId: string,
  ): Promise<UpdateLastViewedPageDTO | null> {
    try {
      const progress = await LearnerProgressModel.findOne({ learnerId })
        .lean()
        .exec();

      if (!progress?.lastViewedPage) {
        return null;
      }

      return {
        moduleId: progress.lastViewedPage.moduleId.toString(),
        pageId: progress.lastViewedPage.pageId.toString(),
      };
    } catch (error) {
      Logger.error(
        `Failed to get last viewed page for learner ${learnerId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getCourseProgressForLearners(
    learnerIds: string[],
  ): Promise<Map<string, CourseProgressDTO>> {
    try {
      const progressMap = new Map<string, CourseProgressDTO>();

      // Get all activity IDs from published modules (shared across all learners)
      const allActivityIds = await this.getAllPublishedActivityIds();
      const publishedModules = await this.getPublishedModules();

      // Fetch all progress records for the given learners in one query
      const objectIds = learnerIds.map((id) => new mongoose.Types.ObjectId(id));
      const progressRecords = await LearnerProgressModel.find({
        learnerId: { $in: objectIds },
      })
        .lean()
        .exec();

      // Create a map of learnerId to progress record for quick lookup
      const progressByLearnerId = new Map(
        progressRecords.map((p) => [p.learnerId.toString(), p]),
      );

      // Calculate progress for each learner
      learnerIds.forEach((learnerId) => {
        const progress = progressByLearnerId.get(learnerId);

        const completedActivitySet = new Set(
          progress?.completedActivities?.map((id) => id.toString()) || [],
        );

        const completedInPublished = allActivityIds.filter((id) =>
          completedActivitySet.has(id),
        );

        const completedModuleCount =
          progress?.moduleCompletions?.filter((mc) =>
            publishedModules.some((pm) => pm.id === mc.moduleId.toString()),
          ).length || 0;

        // Calculate progress percentage:
        // If there are no activities in any published modules, consider it 100% complete
        // (modules with no activities are considered completed)
        const progressPercentage =
          allActivityIds.length > 0
            ? Math.round(
                (completedInPublished.length / allActivityIds.length) * 100,
              )
            : publishedModules.length > 0
              ? 100
              : 0;

        progressMap.set(learnerId, {
          totalActivities: allActivityIds.length,
          completedActivities: completedInPublished.length,
          progressPercentage,
          totalModules: publishedModules.length,
          completedModules: completedModuleCount,
        });
      });

      return progressMap;
    } catch (error) {
      Logger.error(
        `Failed to get course progress for multiple learners. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default LearnerProgressService;
