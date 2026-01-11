import { Box, Typography, useTheme } from "@mui/material";
import * as React from "react";
import {
  isMultiSelectActivity,
  MultipleChoiceActivity,
  MultiSelectActivity,
} from "../../../types/CourseTypes";
import MultipleChoiceViewOption from "./MultipleChoiceViewOption";
import { useUser } from "../../../hooks/useUser";

type MultipleChoiceViewerProps = {
  activity: MultipleChoiceActivity | MultiSelectActivity;
  onWrongAnswer: () => void;
  onCorrectAnswer: () => void;
};

export type ActivityViewerHandle = {
  checkAnswer: () => void;
  onRetry?: () => void;
};

const MultipleChoiceViewer = React.forwardRef<
  ActivityViewerHandle,
  MultipleChoiceViewerProps
>(({ activity, onWrongAnswer, onCorrectAnswer }, ref) => {
  const theme = useTheme();
  const { role } = useUser();
  const [selectedOptions, setSelectedOptions] = React.useState<number[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(role === "Facilitator");

  const checkAnswer = () => {
    const correctOptions = isMultiSelectActivity(activity)
      ? activity.correctAnswers
      : [activity.correctAnswer];
    const isCorrect =
      selectedOptions.length === correctOptions.length &&
      selectedOptions.every((value) => correctOptions.includes(value));
    if (!isCorrect) {
      onWrongAnswer();
    } else {
      onCorrectAnswer();
      setIsCompleted(true);
    }
  };

  React.useImperativeHandle(ref, () => ({
    checkAnswer,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        height: "582px",
        padding: "0 32px 0 33px",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",

        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[400]}`,
        background: theme.palette.Neutral[100],
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "711px",
          height: "582px",
          padding: "24px 0",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "705px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Typography variant="titleLarge">{activity.title}</Typography>
          <Typography
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[500] }}
          >
            {isMultiSelectActivity(activity)
              ? "Pick all the answers that are correct. There can be more than 1 correct answer."
              : "Pick the correct answer"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
          }}
        >
          {activity.imageUrl && (
            <Box
              sx={{
                display: "flex",
                width: "250px",
                minWidth: "250px",
                maxWidth: "300px",
                minHeight: "250px",
                maxHeight: "300px",
                padding: "24px 16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                alignSelf: "stretch",
                aspectRatio: "1 / 1",

                border: "1px dashed #000",
                ...(activity.imageUrl
                  ? {
                      backgroundImage: `url(${activity.imageUrl})`,
                      backgroundSize: "cover",
                    }
                  : {}),
              }}
            />
          )}
          {activity.additionalContext && (
            <Box
              sx={{
                display: "flex",
                padding: "12px 16px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                flex: "1 0 0",
                alignSelf: "stretch",

                border: `1px solid ${theme.palette.Neutral[400]}`,
                background: theme.palette.Neutral[100],
              }}
            >
              <Typography
                sx={{
                  alignSelf: "stretch",

                  color: theme.palette.Neutral[700],
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "0.2px",
                }}
              >
                Additional context:
              </Typography>
              <Typography variant="bodySmall">
                {activity.additionalContext}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            rowGap: "24px",
            columnGap: "34px",
            flexWrap: "wrap",
          }}
        >
          {activity.options.map((option, index) => (
            <MultipleChoiceViewOption
              key={index}
              optionText={option}
              selected={selectedOptions.includes(index)}
              displayCorrect={
                isCompleted &&
                (isMultiSelectActivity(activity)
                  ? activity.correctAnswers
                  : [activity.correctAnswer]
                ).includes(index)
              }
              isMultiSelect={isMultiSelectActivity(activity)}
              onClick={() => {
                if (isCompleted) return;
                if (isMultiSelectActivity(activity)) {
                  if (selectedOptions.includes(index)) {
                    setSelectedOptions(
                      selectedOptions.filter((i) => i !== index),
                    );
                  } else {
                    setSelectedOptions([...selectedOptions, index]);
                  }
                } else {
                  setSelectedOptions([index]);
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
});

MultipleChoiceViewer.displayName = "MultipleChoiceViewer";

export default MultipleChoiceViewer;
