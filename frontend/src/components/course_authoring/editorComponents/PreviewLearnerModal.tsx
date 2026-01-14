import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Activity,
  isMatchingActivity,
  isMultipleChoiceActivity,
  isMultiSelectActivity,
  isTableActivity,
} from "../../../types/CourseTypes";
import MatchingViewer from "../../course_viewing/matching/MatchingViewer";
import MultipleChoiceViewer from "../../course_viewing/multiple-choice/MultipleChoiceViewer";
import TableViewer from "../../course_viewing/table/TableViewer";

const PreviewLearnerModal = ({
  activity,
  open,
  handleClose,
}: {
  activity: Activity;
  open: boolean;
  handleClose: () => void;
}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          display: "flex",
          minWidth: "fit-content",
          width: "fit-content",
          flexDirection: "column",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.Neutral[400]}`,
          background: theme.palette.Neutral[100],
          overflow: "hidden",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        height="56px"
        sx={{
          backgroundColor: theme.palette.Learner.Light.Default,
          padding: "4px 4px 4px 16px",
        }}
      >
        <Typography variant="labelMedium">Preview (Learner View)</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Box sx={{ padding: "20px" }}>
        {(isMultipleChoiceActivity(activity) ||
          isMultiSelectActivity(activity)) && (
          <MultipleChoiceViewer
            activity={activity}
            onWrongAnswer={() => {}}
            onCorrectAnswer={() => {}}
            isCompleted={false}
          />
        )}
        {isTableActivity(activity) && (
          <TableViewer
            activity={activity}
            onWrongAnswer={() => {}}
            onCorrectAnswer={() => {}}
            isCompleted={false}
          />
        )}
        {isMatchingActivity(activity) && (
          <MatchingViewer
            activity={activity}
            onWrongAnswer={() => {}}
            onCorrectAnswer={() => {}}
            isCompleted={false}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default PreviewLearnerModal;
