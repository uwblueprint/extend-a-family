/**
 * Types for learner progress tracking functionality.
 */

export interface LastViewedPageDTO {
  moduleId: string;
  pageId: string;
  viewedAt: Date;
}

export interface ModuleCompletionDTO {
  moduleId: string;
  completedAt: Date;
}

export interface LearnerProgressDTO {
  id: string;
  learnerId: string;
  completedActivities: string[];
  moduleCompletions: ModuleCompletionDTO[];
  lastViewedPage?: LastViewedPageDTO;
}

/**
 * Progress information to be attached to a module when queried by learner.
 */
export interface ModuleProgressDTO {
  totalActivities: number;
  completedActivities: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
}

/**
 * Progress information for an individual activity.
 */
export interface ActivityProgressDTO {
  activityId: string;
  isCompleted: boolean;
}

/**
 * Course-wide progress summary for a learner.
 */
export interface CourseProgressDTO {
  totalActivities: number;
  completedActivities: number;
  progressPercentage: number;
  totalModules: number;
  completedModules: number;
}

/**
 * Input DTO for marking an activity as complete.
 */
export interface CompleteActivityDTO {
  activityId: string;
  moduleId: string;
}

/**
 * Input DTO for updating last viewed page.
 */
export interface UpdateLastViewedPageDTO {
  moduleId: string;
  pageId: string;
}

/**
 * Learner with progress information (for facilitator view).
 */
export interface LearnerWithProgressDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  profilePicture?: string;
  courseProgress: CourseProgressDTO;
}

/**
 * Unit with progress information (for learner view).
 */
export interface UnitWithProgressDTO {
  id: string;
  displayIndex: number;
  title: string;
  modules: string[];
  courseProgress: CourseProgressDTO;
}
