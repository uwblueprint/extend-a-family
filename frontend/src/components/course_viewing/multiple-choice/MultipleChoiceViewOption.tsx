import {
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  RadioButtonCheckedOutlined,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";

export default function MultipleChoiceViewOption({
  isMultiSelect,
  optionText,
  selected,
  displayCorrect,
  onClick,
}: {
  isMultiSelect: boolean;
  optionText: string;
  selected?: boolean;
  displayCorrect?: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  let iconElement: JSX.Element;
  if (displayCorrect) {
    iconElement = <Check />;
  } else if (isMultiSelect) {
    if (selected) {
      iconElement = <CheckBox />;
    } else {
      iconElement = <CheckBoxOutlineBlank />;
    }
  } else if (selected) {
    iconElement = <RadioButtonCheckedOutlined />;
  } else {
    iconElement = <RadioButtonUncheckedOutlined />;
  }

  let backgroundColor: string | null = null;
  if (displayCorrect) {
    backgroundColor = "#F5FFDF"; // light green
  } else if (selected) {
    // eslint-disable-next-line prefer-destructuring
    backgroundColor = theme.palette.Neutral[100];
  }

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
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: "1 0 0",
          maxHeight: "68px",
          overflow: "visible",
          padding: "4px 8px 4px 0",
          justifyContent: "flex-start",
          position: "relative",

          border: `1px solid ${theme.palette.Neutral[400]}`,
          borderRadius: "4px",
          backgroundColor,
        }}
      >
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
            {iconElement}
          </Box>
        </Box>
        <Typography variant="bodySmall">{optionText}</Typography>
      </Box>
    </Box>
  );
}
