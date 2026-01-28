import { CourseUnit } from "../../../types/CourseTypes";
import { FeedbackPopulated } from "../../../types/FeedbackTypes";

// Utility functions for filtering feedbacks
export const getFeedbacksByUnitId = (
  feedbacks: FeedbackPopulated[],
  unit: CourseUnit,
): FeedbackPopulated[] => {
  return feedbacks.filter((feedback) =>
    unit.modules.some((module) => module.id === feedback.moduleId.id),
  );
};

export const getFeedbacksByModuleId = (
  feedbacks: FeedbackPopulated[],
  moduleId: string,
): FeedbackPopulated[] => {
  return feedbacks.filter((feedback) => feedback.moduleId.id === moduleId);
};

export const calculateAverageEasiness = (
  feedbacks: FeedbackPopulated[],
): number | null => {
  if (feedbacks.length === 0) return null;
  return (
    feedbacks.reduce((acc, feedback) => acc + feedback.difficulty, 0) /
    feedbacks.length
  );
};

export const calculateLikedPercentage = (
  feedbacks: FeedbackPopulated[],
): number | null => {
  if (feedbacks.length === 0) return null;
  return (
    (feedbacks.filter((feedback) => feedback.isLiked).length /
      feedbacks.length) *
    100
  );
};
