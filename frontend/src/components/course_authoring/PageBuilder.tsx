import React from "react";
import { Box, useTheme } from "@mui/material";

const PageBuilder = () => {
  const theme = useTheme();
  return (
    <Box
      width="100%"
      height="100%"
      border="1px dashed"
      borderRadius="8px"
      borderColor={theme.palette.Administrator.Default}
      bgcolor={theme.palette.Administrator.Light}
    />
  );
};

export default PageBuilder;
