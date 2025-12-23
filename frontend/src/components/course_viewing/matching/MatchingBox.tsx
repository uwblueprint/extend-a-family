import { Box, Typography, useTheme } from "@mui/material";
import { useUser } from "../../../hooks/useUser";
import { Media } from "../../../types/CourseTypes";

type MatchingBoxProps = {
  item?: Media & { rowIdx: number };
  isSelected: boolean;
  isMatched: boolean;
  feedbackStatus?: "correct" | "wrong";
  onClick: () => void;
  registerRef: (node: HTMLDivElement | null) => void;
};

const MatchingBox = ({
  item,
  isSelected,
  isMatched,
  feedbackStatus,
  onClick,
  registerRef,
}: MatchingBoxProps) => {
  const theme = useTheme();
  const { role: actualRole } = useUser();
  const role = actualRole === "Administrator" ? "Learner" : actualRole;

  let feedbackStyles = {} as Record<string, string>;
  if (feedbackStatus === "correct") {
    feedbackStyles = {
      borderColor: theme.palette.Success.Dark.Default,
      backgroundColor: theme.palette.Success.Light.Selected,
    };
  } else if (feedbackStatus === "wrong") {
    feedbackStyles = {
      borderColor: theme.palette.Error.Dark.Default,
      backgroundColor: theme.palette.Error.Light.Selected,
    };
  }

  const baseBoxStyles = {
    border: `1px solid ${theme.palette.Neutral[400]}`,
    borderRadius: "4px",
    cursor: item ? "pointer" : "default",
    // transition: "border-color 120ms ease, box-shadow 120ms ease",
    outline: "none",
    borderColor:
      isSelected || isMatched
        ? theme.palette[role].Dark.Default
        : theme.palette.Neutral[400],
    ...(isSelected
      ? { backgroundColor: theme.palette[role].Light.Selected }
      : {}),
    ...feedbackStyles,
    "&:hover": {
      backgroundColor: item
        ? theme.palette[role].Light.Hover
        : theme.palette.Neutral[400],
    },
    "&:focus": {
      backgroundColor: theme.palette[role].Light.Pressed,
    },
  } as const;

  if (!item) {
    return (
      <Box
        ref={registerRef}
        sx={{
          display: "flex",
          width: "210px",
          height: "56px",
          minHeight: "56px",
          maxHeight: "56px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexShrink: 0,
          padding: "4px 0 4px 16px",
          ...baseBoxStyles,
        }}
      />
    );
  }

  if (item.mediaType === "text") {
    return (
      <Box
        ref={registerRef}
        role="button"
        tabIndex={0}
        onClick={onClick}
        sx={{
          display: "flex",
          width: "210px",
          height: "56px",
          minHeight: "56px",
          maxHeight: "56px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexShrink: 0,
          padding: "4px 0 4px 16px",
          ...baseBoxStyles,
        }}
      >
        <Typography variant="bodyMedium">{item.context}</Typography>
      </Box>
    );
  }
  return (
    <Box
      ref={registerRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      sx={{
        minWidth: "72px",
        maxWidth: "80px",
        minHeight: "72px",
        maxHeight: "80px",
        aspectRatio: "1 / 1",
        p: 0,
        ...baseBoxStyles,
        color: theme.palette.Neutral[800],
        ...(item.context
          ? {
              backgroundImage: `url(${item.context})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}),
      }}
    />
  );
};

export default MatchingBox;
