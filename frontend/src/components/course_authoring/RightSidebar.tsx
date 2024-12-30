import React from "react";
import { Box, useTheme } from "@mui/material";

const RightSidebar = () => {
  const theme = useTheme();
  return <Box height="100%" bgcolor={theme.palette.Neutral[200]} />;
};

export default RightSidebar;
