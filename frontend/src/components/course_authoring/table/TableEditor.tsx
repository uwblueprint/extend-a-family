import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { Activity } from "../../../types/CourseTypes";
import TitleEditor from "../editorComponents/TitleEditor";

const TableMainEditor = ({
  activity,
  setActivity,
}: {
  activity: Activity;
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "582px",
        padding: "0 32px 0 33px",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",

        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[400]}`,
        background: theme.palette.Neutral[100],
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "711px",
          height: "582px",
          padding: "24px 0",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "705px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <TitleEditor
            title={activity.title}
            setTitle={(newTitle) => {
              setActivity((prev) => prev && { ...prev, title: newTitle });
            }}
          />
          <Typography
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[500] }}
          >
            Pick the box or boxes that show the right answer for that row.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            rowGap: "24px",
            columnGap: "34px",
            flexWrap: "wrap",
          }}
        />
      </Box>
    </Box>
  );
};

export default TableMainEditor;
