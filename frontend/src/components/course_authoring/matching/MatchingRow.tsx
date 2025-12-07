import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { Button, Stack, TextField, useTheme } from "@mui/material";
import React from "react";
import ActivityAPIClient from "../../../APIClients/ActivityAPIClient";
import {
  Activity,
  isMatchingActivity,
  MatchingActivity,
  Media,
} from "../../../types/CourseTypes";
import VisuallyHiddenInput from "../../common/form/VisuallyHiddenInput";
import DeleteCircleButton from "../editorComponents/DeleteCircleButton";
import LongRightArrow from "./LongRightArrow";

const MediaDisplay = ({
  mediaItem,
  onChange,
}: {
  mediaItem: Media;
  onChange: (newValue: string) => void;
}) => {
  const theme = useTheme();
  if (mediaItem.mediaType === "image") {
    return (
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        sx={{
          minWidth: "72px",
          maxWidth: "80px",
          minHeight: "72px",
          maxHeight: "80px",
          aspectRatio: "1 / 1",
          p: 0,
          border: `1px solid ${theme.palette.Neutral[400]}`,
          color: theme.palette.Neutral[800],
          ...(mediaItem.context
            ? {
                backgroundImage: `url(${mediaItem.context})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}),
        }}
      >
        <AddPhotoAlternateOutlined sx={{ color: theme.palette.Neutral[800] }} />
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file: File | undefined = event.target.files?.[0];
            const path = `activity/imageData/matching-${crypto.randomUUID()}`;
            if (file) {
              const uploadedImagePath = await ActivityAPIClient.uploadImage(
                path,
                file,
              );
              if (uploadedImagePath) {
                onChange(uploadedImagePath);
              }
            }
          }}
        />
      </Button>
    );
  }

  // mediaItem.mediaType === "text"
  return (
    <TextField
      sx={{ width: "231.8px", maxHeight: "64px" }}
      placeholder="[Click here to edit]"
      defaultValue={mediaItem.context}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const MatchingRow = ({
  rowNum,
  media,
  onDelete,
  setActivity,
}: {
  rowNum: number;
  media: MatchingActivity["media"];
  onDelete: () => void;
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
}) => {
  const threeColumns = "3" in media;

  const handleChange = (colIdx: string) => (newValue: string) =>
    setActivity((prev) => {
      if (!prev || !isMatchingActivity(prev)) return prev;
      const updatedMedia: MatchingActivity["media"] = {
        ...prev.media,
        [colIdx]: prev.media[colIdx].map((item, index) =>
          index === rowNum ? { ...item, context: newValue } : item,
        ),
      };
      return { ...prev, media: updatedMedia };
    });

  return (
    <Stack
      direction="row"
      gap="16px"
      alignItems="center"
      minHeight="52px"
      maxHeight="80px"
      sx={{ width: "100%" }}
    >
      <Stack
        direction="row"
        gap="28px"
        alignItems="center"
        minHeight="52px"
        maxHeight="80px"
        sx={{ width: "100%" }}
      >
        <MediaDisplay
          mediaItem={media["1"][rowNum]}
          onChange={handleChange("1")}
        />
        <LongRightArrow
          labelText={!threeColumns ? `Match ${rowNum + 1}` : undefined}
        />
        <MediaDisplay
          mediaItem={media["2"][rowNum]}
          onChange={handleChange("2")}
        />
        {threeColumns && (
          <>
            <LongRightArrow />
            <MediaDisplay
              mediaItem={media["3"][rowNum]}
              onChange={handleChange("3")}
            />
          </>
        )}
      </Stack>
      <DeleteCircleButton onClick={onDelete} />
    </Stack>
  );
};

export default MatchingRow;
