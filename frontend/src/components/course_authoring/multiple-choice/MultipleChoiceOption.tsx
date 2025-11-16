import {
  Check,
  CheckBoxOutlineBlank,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import DeleteCircleButton from "../editorComponents/DeleteCircleButton";
import { BodySmallTextField } from "../editorComponents/TypographyTextField";

export default function MultipleChoiceOption({
  optionText,
  onTextChange,
  isCorrectAnswer,
  isMultiSelect,
  onSetCorrectAnswer,
  onDelete,
}: {
  optionText: string;
  onTextChange: (newOptionText: string) => void;
  isCorrectAnswer?: boolean;
  isMultiSelect: boolean;
  onSetCorrectAnswer: () => void;
  onDelete: () => void;
}) {
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
            {isMultiSelect ? (
              <CheckBoxOutlineBlank />
            ) : (
              <RadioButtonUncheckedOutlined />
            )}
          </Box>
        </Box>
        <BodySmallTextField
          value={optionText}
          onChange={onTextChange}
          placeholder="Edit option..."
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
        onClick={onSetCorrectAnswer}
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
      <DeleteCircleButton onClick={onDelete} />
    </Box>
  );
}
