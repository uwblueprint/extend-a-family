import {
  Check,
  CheckBoxOutlineBlank,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { Box, TextField, Typography, useTheme } from "@mui/material";

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
}
