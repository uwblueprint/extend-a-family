import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import {
  Activity,
  MatchingActivity,
  isMatchingActivity,
} from "../../../types/CourseTypes";
import TitleEditor from "../editorComponents/TitleEditor";
import MatchingRow from "./MatchingRow";

const MatchingEditor = ({
  activity,
  setActivity,
}: {
  activity: MatchingActivity;
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
          width: "705px",
          height: "582px",
          padding: "24px 0",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "36px",
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
            Match each item on the left with the item that goes with it on the
            right.
          </Typography>
        </Box>
        <Stack direction="column" gap="12px" sx={{ width: "100%" }}>
          {Array.from({ length: activity.rows }).map((__, rowIndex) => (
            <MatchingRow
              key={rowIndex}
              rowNum={rowIndex}
              media={activity.media}
              onDelete={() =>
                setActivity((prev) => {
                  if (!prev || !isMatchingActivity(prev)) return prev;

                  const updatedMedia = Object.entries(prev.media).reduce(
                    (acc, [columnKey, mediaArray]) => ({
                      ...acc,
                      [columnKey]: mediaArray.filter(
                        (_, mediaIndex) => mediaIndex !== rowIndex,
                      ),
                    }),
                    {} as MatchingActivity["media"],
                  );

                  return {
                    ...prev,
                    media: updatedMedia,
                    rows: Math.max(prev.rows - 1, 0),
                  };
                })
              }
              setActivity={setActivity}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default MatchingEditor;
