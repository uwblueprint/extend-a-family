import {
  AddPhotoAlternate,
  Check,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { VisuallyHidden } from "@reach/visually-hidden";
import React from "react";
import ActivityAPIClient from "../../../APIClients/ActivityAPIClient";
import {
  Activity,
  isMultipleChoiceActivity,
  MultipleChoiceActivity,
} from "../../../types/CourseTypes";

const TitleEditor = ({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (newTitle: string) => void;
}) => {
  return (
    <TextField
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="[Click to add the question]"
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "24px",
          fontWeight: 600,
          lineHeight: "120%",
          textTransform: "none",
          fontFamily: "Lexend Deca, sans-serif",
          padding: 0,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiOutlinedInput-root": {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      }}
    />
  );
};

const MultipleChoiceOption = ({
  optionText,
  onTextChange,
  isCorrectAnswer,
  onSetCorrectAnswer,
  onDelete,
}: {
  optionText: string;
  onTextChange: (newOptionText: string) => void;
  isCorrectAnswer?: boolean;
  onSetCorrectAnswer: () => void;
  onDelete: () => void;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flex: "1 0 0",
        minWidth: "320px",
        maxWidth: "320px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: "1 0 0",
          maxHeight: "68px",
          overflow: "visible",
          padding: "4px 8px 4px 0",
          justifyContent: "space-between",
          position: "relative",

          border: `1px solid ${theme.palette.Neutral[400]}`,
          backgroundColor: isCorrectAnswer ? "#F5FFDF" : "transparent",
        }}
      >
        {isCorrectAnswer && (
          <Typography
            variant="bodySmall"
            sx={{
              position: "absolute",
              top: "-12px",
              left: "8px",
              backgroundColor: "white",
              color: theme.palette.Neutral[600],
              padding: "2px 6px",
              borderRadius: "2px",
              zIndex: 1,
            }}
          >
            Correct answer
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            width: "48px",
            height: "48px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RadioButtonUncheckedOutlined />
          </Box>
        </Box>
        <TextField
          variant="outlined"
          fullWidth
          multiline
          placeholder="Edit option..."
          value={optionText}
          onChange={(e) => onTextChange(e.target.value)}
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

      <Box
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid",
          borderColor: theme.palette.Success.Dark.Default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          backgroundColor: isCorrectAnswer
            ? theme.palette.Success.Dark.Default
            : "transparent",
        }}
        onClick={() => !isCorrectAnswer && onSetCorrectAnswer()}
      >
        <Check
          width="24"
          height="24"
          sx={{
            color: isCorrectAnswer
              ? "white"
              : theme.palette.Success.Dark.Default,
          }}
        />
      </Box>
      <Box
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid",
          borderColor: theme.palette.Neutral[400],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.6302 3.526V4.53469H20.6737V6.55206H19.665V19.665C19.665 20.7746 18.7572 21.6824 17.6476 21.6824H7.56073C6.45117 21.6824 5.54336 20.7746 5.54336 19.665V6.55206H4.53467V4.53469H9.5781V3.526H15.6302ZM7.56073 19.665H17.6476V6.55206H7.56073V19.665ZM9.5781 8.56944H11.5955V17.6476H9.5781V8.56944ZM15.6302 8.56944H13.6129V17.6476H15.6302V8.56944Z"
            fill="#AD2323"
          />
        </svg>
      </Box>
    </Box>
  );
};

const MultipleChoiceMainEditor = ({
  activity,
  setActivity,
  hasImage,
  hasAdditionalContext,
}: {
  activity: MultipleChoiceActivity;
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
  hasImage: boolean;
  hasAdditionalContext: boolean;
}) => {
  const theme = useTheme();

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
            Pick the correct answer
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
              isCorrectAnswer={index === activity.correctAnswer}
              onSetCorrectAnswer={() => {
                setActivity(
                  (prev) => prev && { ...prev, correctAnswer: index },
                );
              }}
              onDelete={() => {
                setActivity((prev) => {
                  if (!prev || !isMultipleChoiceActivity(prev)) return prev;
                  const newOptions = prev.options.filter((_, i) => i !== index);
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
                });
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

MultipleChoiceMainEditor.displayName = "MultipleChoiceMainEditor";

export default MultipleChoiceMainEditor;
