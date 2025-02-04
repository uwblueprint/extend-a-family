import React from "react";
import { Box, useTheme } from "@mui/material";

const PagePreview = () => {
  const theme = useTheme();
  return (
    <Box
      width="100%"
      height="100%"
      border="1px solid"
      borderRadius="8px"
      borderColor={theme.palette.Neutral[400]}
    />
  );
};

export default PagePreview;
