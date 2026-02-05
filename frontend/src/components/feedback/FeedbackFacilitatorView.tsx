import { Search } from "@mui/icons-material";
import {
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useFeedbacks } from "../../contexts/FeedbacksContext"
import { isCaseInsensitiveSubstring } from "../../utils/StringUtils";
import { useCourseUnits } from "../../contexts/CourseUnitsContext";
import StartAdornedTextField from "../common/form/StartAdornedTextField";
import LearnerFeedbackBlock from "./LearnerFeedbackBlock";

const FeedbackFacilitatorView = (): React.ReactElement => {
  const theme = useTheme();
  const { role } = useUser();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { feedbacks } = useFeedbacks();
  const { courseUnits } = useCourseUnits();
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    // name filter
    const fullName = `${feedback.learnerId.firstName} ${feedback.learnerId.lastName}`;
    const matchesSearch =
      !searchQuery ||
      isCaseInsensitiveSubstring(feedback.learnerId.firstName, searchQuery) ||
      isCaseInsensitiveSubstring(feedback.learnerId.lastName, searchQuery) ||
      isCaseInsensitiveSubstring(fullName, searchQuery);

    // unit filter
    const matchesUnit =
      !selectedUnit ||
      courseUnits.some(
        (unit) =>
          unit.id === selectedUnit &&
          unit.modules.some((m) => m.id === feedback.moduleId.id)
      );

    // Module filter
    const matchesModule = !selectedModule || feedback.moduleId.id === selectedModule;

    return matchesSearch && matchesUnit && matchesModule;
  });

  const groupedByLearner = filteredFeedbacks.reduce(
    (acc, feedback) => {
      const learnerId = feedback.learnerId.id;
      if (!acc[learnerId]) {
        acc[learnerId] = {
          learnerName: feedback.learnerId,
          feedbacks: [],
        };
      }
      acc[learnerId].feedbacks.push(feedback);
      return acc;
    },
    {} as Record<string, { learnerName: typeof feedbacks[0]["learnerId"]; feedbacks: typeof feedbacks }>
  );

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="space-between"
      gap="24px"
      alignSelf="stretch"
      sx={{ padding: "32px 64px", height: "100%", overflow: "hidden" }}
    >
      <Typography variant="headlineLarge" color={theme.palette.Neutral[700]}>
        View Feedback
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="32px"
        alignSelf="stretch"
      >
        <StartAdornedTextField
          variant="outlined"
          label="Student Name"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
          adornment={
            <Search
              sx={{
                color: isSearchActive
                  ? theme.palette.Neutral[600]
                  : theme.palette.Neutral[500],
              }}
            />
          }
          focusedBorderColor={theme.palette[role].Dark.Default}
          sx={{
            flex: "1 0 0",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isSearchActive
                  ? theme.palette[role].Dark.Default
                  : theme.palette.Neutral[500],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
            },
          }}
        />
        <TextField
          select
          variant="outlined"
          label="Unit"
          value={selectedUnit}
          onChange={(e) => {
            setSelectedUnit(e.target.value);
            setSelectedModule(""); // reset when unit changes
          }}
          sx={{ minWidth: "200px" }}
        >
          <MenuItem value="">
            <Typography variant="labelMedium">All Units</Typography>
          </MenuItem>
          {courseUnits.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              <Typography variant="labelMedium">{unit.title}</Typography>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="outlined"
          label="Module"
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          disabled={!selectedUnit}
          sx={{ minWidth: "200px" }}
        >
          <MenuItem value="">
            <Typography variant="labelMedium">All Modules</Typography>
          </MenuItem>
          {selectedUnit &&
            courseUnits
              .find((u) => u.id === selectedUnit)
              ?.modules.map((module) => (
                <MenuItem key={module.id} value={module.id}>
                  <Typography variant="labelMedium">{module.title}</Typography>
                </MenuItem>
              ))}
        </TextField>
      </Stack>
      <hr
        style={{
          border: "1px solid",
          width: "100%",
          color: theme.palette.Neutral[300],
          margin: 0,
        }}
      />
      <Stack
        direction="column"
        alignItems="flex-start"
        gap="24px"
        alignSelf="stretch"
        flexGrow="1"
        sx={{ overflow: "auto", minHeight: 0 }}
      >
        {Object.entries(groupedByLearner).map(([learnerId, { learnerName, feedbacks: learnerFeedbacks }]) => (
          <LearnerFeedbackBlock
            key={learnerId}
            learnerName={`${learnerName.firstName} ${learnerName.lastName.charAt(0)}.`}
            feedbacks={learnerFeedbacks}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default FeedbackFacilitatorView;
