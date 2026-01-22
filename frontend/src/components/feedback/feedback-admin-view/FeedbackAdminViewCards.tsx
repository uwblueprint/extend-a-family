import { Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { CourseModule, CourseUnit } from "../../../types/CourseTypes";
import { FeedbackPopulated } from "../../../types/FeedbackTypes";
import FeedbackCard from "../FeedbackCard";
import {
  getFeedbacksByUnitId,
  getFeedbacksByModuleId,
  calculateAverageEasiness,
  calculateLikedPercentage,
} from "./feedbackUtils";
import { useCourseUnits } from "../../../contexts/CourseUnitsContext";

const SummaryCard = ({
  label,
  title,
  easiness,
  liked,
  outOf,
  onClick,
  buttonText,
}: {
  label: string;
  title: string;
  easiness: number | null;
  liked: number | null;
  outOf: string;
  onClick: () => void;
  buttonText: string;
}) => {
  const theme = useTheme();
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      gap="16px"
      padding="24px"
      border={`1px solid ${theme.palette.Neutral[300]}`}
      borderRadius="4px"
    >
      <Typography variant="labelLarge" fontWeight="700">
        {label}
      </Typography>
      <Typography variant="titleMedium">{title}</Typography>
      <Divider sx={{ width: "100%" }} />
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-end"
        gap="24px"
      >
        <Typography variant="titleMedium">
          {easiness !== null ? `${easiness.toFixed(1)}/5` : "-/5"} Easy
        </Typography>
        <Typography variant="titleMedium">
          {liked !== null ? `${Math.round(liked)}%` : "-%"} Liked
        </Typography>
      </Stack>
      <Typography variant="labelMedium">Out of {outOf}</Typography>
      <Button
        sx={{
          width: "100%",
          padding: "10px 24px 10px 16px",
          color: theme.palette.Administrator.Dark.Default,

          borderRadius: "4px",
          border: `1px solid ${theme.palette.Neutral[500]}`,
        }}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Stack>
  );
};

export const FeedbackAdminCourseView = ({
  units,
  feedbacks,
  setSelectedUnitId,
}: {
  units: CourseUnit[];
  feedbacks: FeedbackPopulated[];
  setSelectedUnitId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      gap="24px"
      alignSelf="stretch"
    >
      <Typography variant="headlineSmall">Unit Feedback</Typography>
      <Stack
        direction="row"
        alignItems="flex-start"
        gap="24px"
        flexWrap="wrap"
        alignSelf="stretch"
      >
        {units.map((unit) => {
          const unitFeedbacks = getFeedbacksByUnitId(feedbacks, unit);
          const easiness = calculateAverageEasiness(unitFeedbacks);
          const liked = calculateLikedPercentage(unitFeedbacks);

          return (
            <SummaryCard
              key={unit.id}
              label={`Unit ${unit.displayIndex}`}
              title={unit.title}
              easiness={easiness}
              liked={liked}
              outOf={`${unit.modules.length} Modules`}
              onClick={() => setSelectedUnitId(unit.id)}
              buttonText="View Unit Feedback"
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export const FeedbackAdminUnitView = ({
  unit,
  modules,
  feedbacks,
  setSelectedModuleId,
}: {
  unit: CourseUnit;
  modules: CourseModule[];
  feedbacks: FeedbackPopulated[];
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { moduleDisplayIndex } = useCourseUnits();
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      gap="24px"
      alignSelf="stretch"
    >
      <Typography variant="headlineSmall">
        Unit {unit.displayIndex} Modules Feedback
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-start"
        gap="24px"
        flexWrap="wrap"
        alignSelf="stretch"
      >
        {modules.map((module) => {
          const moduleFeedbacks = getFeedbacksByModuleId(feedbacks, module.id);
          const easiness = calculateAverageEasiness(moduleFeedbacks);
          const liked = calculateLikedPercentage(moduleFeedbacks);

          return (
            <SummaryCard
              key={module.id}
              label={`Module ${moduleDisplayIndex(module.id)}`}
              title={module.title}
              easiness={easiness}
              liked={liked}
              outOf={`${moduleFeedbacks.length} Reviews`}
              onClick={() => setSelectedModuleId(module.id)}
              buttonText="View Module Feedback"
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export const FeedbackAdminModuleView = ({
  module,
  feedbacks,
}: {
  module: CourseModule;
  feedbacks: FeedbackPopulated[];
}) => {
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      gap="24px"
      alignSelf="stretch"
    >
      <Typography variant="headlineSmall">
        Comments for &quot;{module.title}&quot;
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-start"
        gap="24px"
        flexWrap="wrap"
        alignSelf="stretch"
      >
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            title={
              <Stack direction="row" gap="8px" alignItems="center" flex="1 0 0">
                <Typography variant="bodyMedium">{`${feedback.learnerId.firstName} ${feedback.learnerId.lastName}`}</Typography>
                <Typography variant="bodyMedium">•</Typography>
                <Typography variant="labelMedium" color="text.secondary">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            }
          />
        ))}
      </Stack>
    </Stack>
  );
};
