import * as React from "react";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { useHistory, useLocation } from "react-router-dom";
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
import { getFeedbacksByUnitId, getFeedbacksByModuleId } from "./feedbackUtils";

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

// Cache data at module level to persist across component remounts
let cachedCourseUnits: Array<CourseUnit> | null = null;
let cachedAllFeedbacks: Array<FeedbackPopulated> | null = null;
let isFetching = false;

const FeedbackAdminView = () => {
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();

  const [courseUnits, setCourseUnits] = React.useState<Array<CourseUnit>>(
    cachedCourseUnits || [],
  );
  const [allFeedbacks, setAllFeedbacks] = React.useState<
    Array<FeedbackPopulated>
  >(cachedAllFeedbacks || []);

  React.useEffect(() => {
    if (isFetching) return;

    if (cachedCourseUnits && cachedAllFeedbacks) {
      setCourseUnits(cachedCourseUnits);
      setAllFeedbacks(cachedAllFeedbacks);
      return;
    }

    isFetching = true;

    Promise.all([
      CourseAPIClient.getUnits(),
      FeedbackAPIClient.fetchAllFeedback(),
    ]).then(([units, feedbacks]) => {
      cachedCourseUnits = units;
      cachedAllFeedbacks = feedbacks;
      setCourseUnits(units);
      setAllFeedbacks(feedbacks);
      isFetching = false;
    });
  }, []);

  // Initialize state from URL params only once
  const initialUnitIdRef = React.useRef<string | null>(null);
  const initialModuleIdRef = React.useRef<string | null>(null);
  const hasInitializedFromUrlRef = React.useRef(false);

  if (!hasInitializedFromUrlRef.current) {
    const queryParams = new URLSearchParams(location.search);
    initialUnitIdRef.current = queryParams.get("unitId");
    initialModuleIdRef.current = queryParams.get("moduleId");
    hasInitializedFromUrlRef.current = true;
  }

  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(
    initialUnitIdRef.current,
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(
    initialModuleIdRef.current,
  );

  // Update URL when selection changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (selectedUnitId) {
      params.set("unitId", selectedUnitId);
    }
    if (selectedModuleId) {
      params.set("moduleId", selectedModuleId);
    }
    const newSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      history.replace({
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : "",
      });
    }
  }, [
    selectedUnitId,
    selectedModuleId,
    history,
    location.pathname,
    location.search,
  ]);

  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);

  const selectedUnit = courseUnits.find((unit) => unit.id === selectedUnitId);

  const filterByDateRange = (feedback: FeedbackPopulated) => {
    const feedbackDate = new Date(feedback.createdAt);
    if (fromDate && feedbackDate < fromDate.toDate()) return false;
    if (toDate && feedbackDate > toDate.endOf("day").toDate()) return false;
    return true;
  };

  const feedbacks = allFeedbacks.filter(filterByDateRange);

  const selectedUnitFeedbacks = selectedUnit
    ? getFeedbacksByUnitId(feedbacks, selectedUnit)
    : [];

  const selectedModule = selectedUnit?.modules.find(
    (module) => module.id === selectedModuleId,
  );
  const selectedModuleFeedbacks = selectedModuleId
    ? getFeedbacksByModuleId(feedbacks, selectedModuleId)
    : [];

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

  const averageEasiness = (): number | null => {
    if (selectedModule) {
      if (selectedModuleFeedbacks.length === 0) return null;
      return (
        selectedModuleFeedbacks.reduce((acc, feedback) => {
          return acc + feedback.difficulty;
        }, 0) / selectedModuleFeedbacks.length
      );
    }
    if (selectedUnit) {
      if (selectedUnitFeedbacks.length === 0) return null;
      return (
        selectedUnitFeedbacks.reduce((acc, feedback) => {
          return acc + feedback.difficulty;
        }, 0) / selectedUnitFeedbacks.length
      );
    }
    if (feedbacks.length === 0) return null;
    return (
      feedbacks.reduce((acc, feedback) => {
        return acc + feedback.difficulty;
      }, 0) / feedbacks.length
    );
  };

  const averageLiked = (): number | null => {
    if (selectedModule) {
      if (selectedModuleFeedbacks.length === 0) return null;
      return (
        (selectedModuleFeedbacks.filter((feedback) => feedback.isLiked).length /
          selectedModuleFeedbacks.length) *
        100
      );
    }
    if (selectedUnit) {
      if (selectedUnitFeedbacks.length === 0) return null;
      return (
        (selectedUnitFeedbacks.filter((feedback) => feedback.isLiked).length /
          selectedUnitFeedbacks.length) *
        100
      );
    }
    if (feedbacks.length === 0) return null;
    return (
      (feedbacks.filter((feedback) => feedback.isLiked).length /
        feedbacks.length) *
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
                  {averageEasiness() !== null
                    ? `${averageEasiness()!.toFixed(1)}/5`
                    : "-/5"}
                </Typography>
              </Stack>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()} reviews
              </Typography>
            </RatingCard>
            <RatingCard>
              <Typography variant="labelLarge" fontWeight="700">
                {currentLabel()} enjoyability rating:
              </Typography>
              <Typography variant="displayMedium">
                {averageLiked() !== null
                  ? `${Math.round(averageLiked()!)}% Liked`
                  : "-% Liked"}
              </Typography>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()} reviews
              </Typography>
            </RatingCard>
          </Stack>
        </Stack>
        {courseView && (
          <FeedbackAdminCourseView
            units={courseUnits}
            feedbacks={feedbacks}
            setSelectedUnitId={setSelectedUnitId}
          />
        )}
        {unitView && selectedUnit && (
          <FeedbackAdminUnitView
            unit={selectedUnit}
            modules={selectedUnit.modules}
            feedbacks={feedbacks}
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
