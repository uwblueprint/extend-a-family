import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

interface CircularProgressWithLabelProps {
  value: number;
  size?: number;
  thickness?: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  size = 175,
  thickness = 5,
}) => {
  const theme = useTheme();
  const percentComplete = Math.round(value);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width={235}
    >
      <Box position="relative" display="inline-flex">
        <CircularProgress // background track
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{
            color: theme.palette.Learner.Light.Selected,
            position: "absolute",
          }}
        />

        <CircularProgress // foreground progress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            color: theme.palette.Learner.Dark.Default,
          }}
        />

        <Box // center caption
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="displayMedium"
            component="div"
            color={theme.palette.Learner.Dark.Default}
          >
            {`${percentComplete}%`}
          </Typography>
        </Box>
      </Box>

      <Typography variant="labelMedium" marginTop={5}>
        {percentComplete}% Course content completed!
      </Typography>
    </Box>
  );
};

export default CircularProgressWithLabel;
