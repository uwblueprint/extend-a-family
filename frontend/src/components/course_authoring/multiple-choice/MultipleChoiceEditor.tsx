import { AddPhotoAlternate } from "@mui/icons-material";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { VisuallyHidden } from "@reach/visually-hidden";
import React from "react";
import ActivityAPIClient from "../../../APIClients/ActivityAPIClient";
import {
  Activity,
  isMultiSelectActivity,
  MultipleChoiceActivity,
  MultiSelectActivity,
} from "../../../types/CourseTypes";
import TitleEditor from "../editorComponents/TitleEditor";
import MultipleChoiceOption from "./MultipleChoiceOption";

const MultipleChoiceMainEditor = ({
  activity,
  setActivity,
  hasImage,
  hasAdditionalContext,
}: {
  activity: MultipleChoiceActivity | MultiSelectActivity;
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
  hasImage: boolean;
  hasAdditionalContext: boolean;
}) => {
  const theme = useTheme();

  const isCorrectAnswer = (index: number) => {
    return isMultiSelectActivity(activity)
      ? activity.correctAnswers.includes(index)
      : index === activity.correctAnswer;
  };

  const onSetCorrectAnswer = (index: number) => {
    if (isMultiSelectActivity(activity)) {
      let newCorrectAnswers = [...activity.correctAnswers];
      if (newCorrectAnswers.includes(index)) {
        newCorrectAnswers = newCorrectAnswers.filter((i) => i !== index);
      } else {
        newCorrectAnswers.push(index);
      }
      setActivity((prev) =>
        prev && isMultiSelectActivity(prev)
          ? { ...prev, correctAnswers: newCorrectAnswers }
          : prev,
      );
    } else {
      setActivity((prev) => prev && { ...prev, correctAnswer: index });
    }
  };

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
          <TitleEditor
            title={activity.title}
            setTitle={(newTitle) => {
              setActivity((prev) => prev && { ...prev, title: newTitle });
            }}
          />
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
          {hasImage && (
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
            >
              <Button
                component="label"
                sx={{
                  display: "flex",
                  padding: "10px 24px 10px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "4px",
                  border: "1px solid #6F797B",
                  backgroundColor: "transparent",
                  textTransform: "none",
                  minWidth: "auto",
                  width: "auto",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <AddPhotoAlternate
                  sx={{
                    width: "18px",
                    height: "18px",
                    color: theme.palette.Administrator.Dark.Default,
                  }}
                />
                <Typography
                  variant="labelLarge"
                  sx={{
                    color: theme.palette.Administrator.Dark.Default,
                  }}
                >
                  Add image
                </Typography>
                <VisuallyHidden>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file: File | undefined = e.target.files?.[0];
                      if (file) {
                        ActivityAPIClient.updateActivityMainPicture(
                          activity.id,
                          activity.type,
                          file,
                        ).then(setActivity);
                      }
                    }}
                  />
                </VisuallyHidden>
              </Button>
            </Box>
          )}
          {hasAdditionalContext && (
            <Box
              sx={{
                display: "flex",
                padding: "12px 16px",
                flexDirection: "column",
                alignItems: "center",
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
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={9}
                placeholder="Enter additional context here..."
                value={activity.additionalContext || ""}
                onChange={(e) => {
                  setActivity(
                    (prev) =>
                      prev && {
                        ...prev,
                        additionalContext: e.target.value,
                      },
                  );
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                    textTransform: "none",
                    fontFamily: "Lexend Deca, sans-serif",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                }}
              />
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
            <MultipleChoiceOption
              key={index}
              optionText={option}
              onTextChange={(newOptionText) => {
                setActivity((prev) => {
                  if (!prev) return prev;
                  const newOptions = [...prev.options];
                  newOptions[index] = newOptionText;
                  return { ...prev, options: newOptions };
                });
              }}
              isCorrectAnswer={isCorrectAnswer(index)}
              isMultiSelect={isMultiSelectActivity(activity)}
              onSetCorrectAnswer={() => onSetCorrectAnswer(index)}
              onDelete={() =>
                activity.options.length > 2 &&
                setActivity((prev) => {
                  if (!prev) return prev;
                  const newOptions = prev.options.filter((_, i) => i !== index);
                  if (isMultiSelectActivity(prev)) {
                    const newCorrectAnswers = prev.correctAnswers
                      .filter((i) => i !== index)
                      .map((i) => (i > index ? i - 1 : i));
                    return {
                      ...prev,
                      options: newOptions,
                      correctAnswers: newCorrectAnswers,
                    };
                  }
                  let newCorrectAnswer = prev.correctAnswer;
                  if (index === prev.correctAnswer) {
                    newCorrectAnswer = -1; // No correct answer
                  } else if (index < prev.correctAnswer) {
                    newCorrectAnswer = prev.correctAnswer - 1;
                  }
                  return {
                    ...prev,
                    options: newOptions,
                    correctAnswer: newCorrectAnswer,
                  };
                })
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MultipleChoiceMainEditor;
