import { Box, Stack, TextField, Typography, useTheme } from "@mui/material";
import * as React from "react";
import { TextInputActivity } from "../../../types/CourseTypes";

type TextInputViewerProps = {
  activity: TextInputActivity;
  onWrongAnswer: () => void;
  onCorrectAnswer: () => void;
  isCompleted: boolean;
};

export type ActivityViewerHandle = {
  checkAnswer: () => void;
  onRetry?: () => void;
};

const TextInputViewer = React.forwardRef<
  ActivityViewerHandle,
  TextInputViewerProps
>(({ activity, onWrongAnswer, onCorrectAnswer, isCompleted }, ref) => {
  const theme = useTheme();
  const [userAnswer, setUserAnswer] = React.useState("");

  const correctAnswer = () => {
    if (activity.validation.mode === "short_answer") {
      return activity.validation.answers[0];
    }
    if (activity.validation.mode === "numeric_range") {
      return (
        (activity.validation.min + activity.validation.max) /
        2
      ).toString();
    }
    return "";
  };

  const checkAnswer = () => {
    if (activity.validation.mode === "short_answer") {
      const isCorrect = activity.validation.answers.some(
        (answer) =>
          answer.toLowerCase().trim() === userAnswer.toLowerCase().trim(),
      );
      if (!isCorrect) {
        onWrongAnswer();
      } else {
        onCorrectAnswer();
      }
    } else if (activity.validation.mode === "numeric_range") {
      const userAnswerNum = parseFloat(userAnswer || "");
      const isCorrect =
        !Number.isNaN(userAnswerNum) &&
        userAnswerNum >= activity.validation.min &&
        userAnswerNum <= activity.validation.max;
      if (!isCorrect) {
        onWrongAnswer();
      } else {
        onCorrectAnswer();
      }
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
            Type one word or a short phrase in the box.
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
        <Stack
          direction="row"
          alignItems="center"
          gap="24px"
          alignSelf="stretch"
        >
          <TextField
            placeholder="Enter your answer here"
            fullWidth
            value={isCompleted ? correctAnswer() : userAnswer}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted
                ? theme.palette.Success.Light.Default
                : undefined,
            }}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          {activity.units !== undefined && (
            <Typography
              variant="bodyMedium"
              sx={{ color: theme.palette.Neutral[600] }}
            >
              {activity.units}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
});

TextInputViewer.displayName = "TextInputViewer";

export default TextInputViewer;
