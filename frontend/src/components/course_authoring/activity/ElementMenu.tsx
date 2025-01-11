import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import DraggableSource from "./grid/DraggableSource";
import { DisplayElementType } from "../../../types/CourseElementTypes";

const ElementMenu = () => {
  return (
    <Box>
      <Stack spacing="12px" paddingBottom="24px">
        <Typography variant="titleMedium">Add an element</Typography>
        <Typography variant="bodyMedium">
          Drag an element onto the page.
        </Typography>
      </Stack>
      <DraggableSource key="1" componentType={DisplayElementType.Text}>
        <Box
          style={{
            width: "70px",
            height: "30px",
            border: "1px solid black",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          Text
        </Box>
      </DraggableSource>
    </Box>
  );
};

export default ElementMenu;
