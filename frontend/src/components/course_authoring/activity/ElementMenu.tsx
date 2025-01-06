import React, { useContext } from "react";
import { Box, Stack, Typography } from "@mui/material";
import DraggableSource from "./grid/DraggableSource";
import { ActivityContext } from "../../../contexts/ActivityContext";

const ElementMenu = () => {
  const { targetRef, dispatchLayout } = useContext(ActivityContext);

  return (
    <Box>
      <Stack spacing="12px" paddingBottom="24px">
        <Typography variant="titleMedium">Add an element</Typography>
        <Typography variant="bodyMedium">
          Drag an element onto the page.
        </Typography>
      </Stack>
      <DraggableSource
        targetRef={targetRef}
        dispatch={dispatchLayout}
        key="1"
        componentType="TextBox"
      >
        <div
          style={{
            width: "70px",
            height: "30px",
            border: "1px solid black",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          {" "}
          Text Box
        </div>
      </DraggableSource>
      <div style={{ width: "20px" }} />
      <DraggableSource
        targetRef={targetRef}
        dispatch={dispatchLayout}
        key="2"
        componentType="Match"
      >
        <div
          style={{
            width: "70px",
            height: "30px",
            border: "1px solid black",
            textAlign: "center",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          Match
        </div>
      </DraggableSource>
    </Box>
  );
};

export default ElementMenu;
