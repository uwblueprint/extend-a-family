import React from "react";
import { Box, useTheme } from "@mui/material";

const LeftSidebar = () => {
  const theme = useTheme();
  return (
    <Box height="100%" bgcolor={theme.palette.Neutral[200]} padding="24px" />
  );
};

export default LeftSidebar;
