import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { Button, Stack, TextField, useTheme } from "@mui/material";
import { MatchingActivity, Media } from "../../../types/CourseTypes";
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
  if (mediaItem.mediaType === "media") {
    return (
      <Button
        sx={{
          minWidth: "72px",
          maxWidth: "80px",
          minHeight: "72px",
          maxHeight: "80px",
          aspectRatio: "1 / 1",
          p: 0,
          border: `1px solid ${theme.palette.Neutral[400]}`,
          color: theme.palette.Neutral[800],
        }}
      >
        <AddPhotoAlternateOutlined sx={{ color: theme.palette.Neutral[800] }} />
      </Button>
    );
  }

  // mediaItem.type === "text"
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
}: {
  rowNum: number;
  media: MatchingActivity["media"];
  onDelete: () => void;
}) => {
  const threeColumns = "3" in media;
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
        <MediaDisplay mediaItem={media["1"][rowNum]} onChange={() => {}} />
        <LongRightArrow
          labelText={!threeColumns ? `Match ${rowNum + 1}` : undefined}
        />
        <MediaDisplay mediaItem={media["2"][rowNum]} onChange={() => {}} />
        {threeColumns && (
          <>
            <LongRightArrow
              labelText={!threeColumns ? `Match ${rowNum + 1}` : undefined}
            />
            <MediaDisplay mediaItem={media["3"][rowNum]} onChange={() => {}} />
          </>
        )}
      </Stack>
      <DeleteCircleButton onClick={onDelete} />
    </Stack>
  );
};

export default MatchingRow;
