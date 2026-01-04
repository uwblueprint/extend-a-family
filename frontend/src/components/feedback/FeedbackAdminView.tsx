import * as React from "react";

import { Box, Stack, Typography, useTheme } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { CourseUnit } from "../../types/CourseTypes";
import FeedbackAdminUnitSidebar from "./FeedbackAdminViewSidebar";

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

  const didFetchUnitsRef = React.useRef(false);
  React.useEffect(() => {
    if (didFetchUnitsRef.current) return;
    didFetchUnitsRef.current = true;

    const getCourseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);
    };

    getCourseUnits();
  }, []);

  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(
    null,
  );

  const selectedUnit = courseUnits.find((unit) => unit.id === selectedUnitId);
  const selectedModule = selectedUnit?.modules.find(
    (module) => module.id === selectedModuleId,
  );

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
      return `20 Ratings`;
    }
    if (selectedUnit) {
      return `6 Modules`;
    }
    return `All Modules`;
  };

  return (
    <Box
      display="flex"
      width="100%"
      minHeight="100vh"
      height="100vh"
      overflow="hidden"
    >
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
        overflow="auto"
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
                />
                <Typography variant="labelLarge">-</Typography>
                <DatePicker
                  label={<Typography variant="labelLarge">To</Typography>}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="flex-start" gap="32px">
            <RatingCard>
              <Typography variant="labelLarge" fontWeight="700">
                {currentLabel()} easiness rating:
              </Typography>
              <Stack direction="row" alignItems="center" gap="16px">
                <Typography variant="displayMedium">4.2/5</Typography>
              </Stack>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()}
              </Typography>
            </RatingCard>
            <RatingCard>
              <Typography variant="labelLarge" fontWeight="700">
                {currentLabel()} enjoyability rating:
              </Typography>
              <Typography variant="displayMedium">87% Liked</Typography>
              <Typography variant="labelMedium">
                Out of {ratingsOutOf()}
              </Typography>
            </RatingCard>
          </Stack>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-start"
          gap="24px"
          alignSelf="stretch"
        >
          <Typography variant="headlineSmall">Student Feedback</Typography>
          <Typography variant="bodyMedium" color={theme.palette.Neutral[500]}>
            No feedback available for this period.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FeedbackAdminView;
