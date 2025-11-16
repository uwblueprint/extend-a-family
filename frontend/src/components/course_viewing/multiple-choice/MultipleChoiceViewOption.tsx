import {
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
  onClick,
}: {
  isMultiSelect: boolean;
  optionText: string;
  selected?: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  let iconElement: JSX.Element;
  if (isMultiSelect) {
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
