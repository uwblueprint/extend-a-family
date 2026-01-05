import * as React from "react";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import { CourseUnit } from "../../../types/CourseTypes";
import FeedbackAdminUnitSidebar from "./FeedbackAdminViewSidebar";
import { FeedbackPopulated } from "../../../types/FeedbackTypes";
import FeedbackAPIClient from "../../../APIClients/FeedbackAPIClient";
import {
  FeedbackAdminCourseView,
  FeedbackAdminModuleView,
  FeedbackAdminUnitView,
} from "./FeedbackAdminViewCards";

const RatingCard = ({ children }: { children?: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "16px",
        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[400]}`,
        backgroundColor: theme.palette.Neutral[100],
      }}
    >
      {children}
    </Box>
  );
};

const FeedbackAdminView = () => {
  const theme = useTheme();

  const [courseUnits, setCourseUnits] = React.useState<Array<CourseUnit>>([]);
  const [feedbacks, setFeedbacks] = React.useState<Array<FeedbackPopulated>>(
    [],
  );

  const didFetchRef = React.useRef(false);
  React.useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    CourseAPIClient.getUnits().then(setCourseUnits);
    FeedbackAPIClient.fetchAllFeedback().then(setFeedbacks);
  }, []);

  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(
    null,
  );

  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);

  const selectedUnit = courseUnits.find((unit) => unit.id === selectedUnitId);

  const filterByDateRange = (feedback: FeedbackPopulated) => {
    const feedbackDate = new Date(feedback.createdAt);
    if (fromDate && feedbackDate < fromDate.toDate()) return false;
    if (toDate && feedbackDate > toDate.endOf("day").toDate()) return false;
    return true;
  };

  const selectedUnitFeedbacks = feedbacks.filter(
    (feedback) =>
      selectedUnit?.modules.some(
        (module) => module.id === feedback.moduleId.id,
      ) && filterByDateRange(feedback),
  );

  const selectedModule = selectedUnit?.modules.find(
    (module) => module.id === selectedModuleId,
  );
  const selectedModuleFeedbacks = selectedUnitFeedbacks.filter(
    (feedback) => feedback.moduleId.id === selectedModuleId,
  );

  const courseView = !selectedUnit && !selectedModule;
  const unitView = selectedUnit && !selectedModule;
  const moduleView = selectedUnit && selectedModule;

  const currentTitle = () => {
    if (selectedModule) {
      return selectedModule.title;
    }
    if (selectedUnit) {
      return selectedUnit.title;
    }
    return "Course Feedback";
  };

  const currentLabel = () => {
    if (selectedModule) {
      return `Module ${selectedModule.displayIndex}`;
    }
    if (selectedUnit) {
      return `Unit ${selectedUnit.displayIndex}`;
    }
    return "Course";
  };

  const ratingsOutOf = () => {
    if (selectedModule) {
      return `${selectedModuleFeedbacks.length} Ratings`;
    }
    if (selectedUnit) {
      return `${selectedUnit.modules.length} Modules`;
    }
    return `All Modules`;
  };

  const averageEasiness = () => {
    if (selectedModule) {
      return (
        selectedModuleFeedbacks.reduce((acc, feedback) => {
          return acc + feedback.difficulty;
        }, 0) / selectedModuleFeedbacks.length
      );
    }
    if (selectedUnit) {
      return (
        selectedUnitFeedbacks.reduce((acc, feedback) => {
          return acc + feedback.difficulty;
        }, 0) / selectedUnitFeedbacks.length
      );
    }
    const filteredFeedbacks = feedbacks.filter(filterByDateRange);
    return (
      filteredFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.difficulty;
      }, 0) / filteredFeedbacks.length
    );
  };

  const averageLiked = () => {
    if (selectedModule) {
      return (
        (selectedModuleFeedbacks.filter((feedback) => feedback.isLiked).length /
          selectedModuleFeedbacks.length) *
        100
      );
    }
    if (selectedUnit) {
      return (
        (selectedUnitFeedbacks.filter((feedback) => feedback.isLiked).length /
          selectedUnitFeedbacks.length) *
        100
      );
    }
    const filteredFeedbacks = feedbacks.filter(filterByDateRange);
    return (
      (filteredFeedbacks.filter((feedback) => feedback.isLiked).length /
        filteredFeedbacks.length) *
      100
    );
  };

  return (
    <Box display="flex" width="100%" height="100%" overflow="hidden">
      <FeedbackAdminUnitSidebar
        courseUnits={courseUnits}
        selectedUnitId={selectedUnitId}
        setSelectedUnitId={setSelectedUnitId}
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
      <Stack
        direction="column"
        gap="32px"
        padding="48px"
        alignItems="flex-start"
        flex="1 0 0"
        alignSelf="stretch"
        sx={{ overflow: "auto", minHeight: 0 }}
      >
        <Stack direction="column" alignItems="flex-start" gap="16px">
          <Stack
            direction="column"
            alignItems="flex-start"
            justifyContent="center"
            gap="4px"
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              gap="4px"
              color={theme.palette.Neutral[500]}
            >
              <Typography variant="bodyMedium">Course Feedback</Typography>
              {selectedUnit && (
                <>
                  <Typography variant="bodyMedium">/</Typography>
                  <Typography variant="bodyMedium">
                    {selectedUnit.title}
                  </Typography>
                  {selectedModule && (
                    <>
                      <Typography variant="bodyMedium">/</Typography>
                      <Typography variant="bodyMedium">
                        {selectedModule.title}
                      </Typography>
                    </>
                  )}
                </>
              )}
            </Stack>
            <Typography variant="headlineLarge">{currentTitle()}</Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="16px"
          >
            <Typography variant="labelLarge">Filter by Date:</Typography>
            <Stack direction="row" alignItems="center" gap="8px">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={<Typography variant="labelLarge">From</Typography>}
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                />
                <Typography variant="labelLarge">-</Typography>
                <DatePicker
                  label={<Typography variant="labelLarge">To</Typography>}
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                />
              </LocalizationProvider>
              <Button
                variant="outlined"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
                disabled={!fromDate && !toDate}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="flex-start" gap="32px">
            <RatingCard>
              <Typography variant="labelLarge" fontWeight="700">
                {currentLabel()} easiness rating:
              </Typography>
              <Stack direction="row" alignItems="center" gap="16px">
                <Typography variant="displayMedium">
                  {averageEasiness().toFixed(1)}/5
                </Typography>
              </Stack>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()}
              </Typography>
            </RatingCard>
            <RatingCard>
              <Typography variant="labelLarge" fontWeight="700">
                {currentLabel()} enjoyability rating:
              </Typography>
              <Typography variant="displayMedium">
                {Math.round(averageLiked())}% Liked
              </Typography>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()}
              </Typography>
            </RatingCard>
          </Stack>
        </Stack>
        {courseView && (
          <FeedbackAdminCourseView
            units={courseUnits}
            setSelectedUnitId={setSelectedUnitId}
          />
        )}
        {unitView && selectedUnit && (
          <FeedbackAdminUnitView
            unit={selectedUnit}
            modules={selectedUnit.modules}
            setSelectedModuleId={setSelectedModuleId}
          />
        )}
        {moduleView && selectedUnit && selectedModule && (
          <FeedbackAdminModuleView
            module={selectedModule}
            feedbacks={selectedModuleFeedbacks}
          />
        )}
      </Stack>
    </Box>
  );
};

export default FeedbackAdminView;
