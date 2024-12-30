import React, { useState } from "react";
import { Box } from "@mui/material";
import BottomToolbar from "./BottomToolbar";
import PageBuilder from "./PageBuilder";
import PagePreview from "./PagePreview";

const MainArea = () => {
  const [builder, setBuilder] = useState(false);
  return (
    <Box height="100%" display="flex" flexDirection="column" padding="32px">
      <Box width="100%" marginBottom="32px" sx={{ aspectRatio: "16 / 9" }}>
        {builder ? <PageBuilder /> : <PagePreview />}
      </Box>
      <BottomToolbar
        onBuilderEnter={() => setBuilder(true)}
        onBuilderExit={() => setBuilder(false)}
      />
    </Box>
  );
};

export default MainArea;
