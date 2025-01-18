import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import DraggableSource from "./grid/DraggableSource";
import { DisplayElementType } from "../../../types/CourseElementTypes";

const ElementBox = styled(Box)`
  width: 150px;
  height: 40px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

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
        <ElementBox>
          <Typography variant="labelMedium">Text</Typography>
        </ElementBox>
      </DraggableSource>
    </Box>
  );
};

export default ElementMenu;
