import { Replay } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import {
  Activity,
  isMatchingActivity,
  isMultipleChoiceActivity,
  isMultiSelectActivity,
  isTableActivity,
  isTextInputActivity,
} from "../../../types/CourseTypes";
import MatchingViewer from "../../course_viewing/matching/MatchingViewer";
import WrongAnswerModal from "../../course_viewing/modals/WrongAnswerModal";
import MultipleChoiceViewer from "../../course_viewing/multiple-choice/MultipleChoiceViewer";
import TableViewer from "../../course_viewing/table/TableViewer";
import TextInputViewer, {
  ActivityViewerHandle,
} from "../../course_viewing/text-input/TextInputViewer";

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
  const activityPreviewRef = useRef<ActivityViewerHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
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
        <Stack direction="row" alignItems="center" gap="8px">
          <Button
            onClick={() => {
              if (isCompleted) {
                setIsCompleted(false);
              } else {
                activityPreviewRef.current?.checkAnswer();
              }
            }}
            sx={{
              height: "48px",
              width: "fit-content",
              paddingX: "16px",
              paddingY: "10px",
              gap: "8px",
              border: "1px solid",
              borderColor: theme.palette.Neutral[500],
              borderRadius: "4px",
              backgroundColor: theme.palette.Learner.Dark.Default,
              color: "white",
            }}
          >
            <Typography variant="labelLarge">
              {isCompleted ? (
                <>
                  <Replay /> Reset
                </>
              ) : (
                "Check Answer"
              )}
            </Typography>
          </Button>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Box sx={{ padding: "20px" }}>
        {(isMultipleChoiceActivity(activity) ||
          isMultiSelectActivity(activity)) && (
          <MultipleChoiceViewer
            activity={activity}
            onWrongAnswer={() => setShowWrongAnswerModal(true)}
            onCorrectAnswer={() => setIsCompleted(true)}
            isCompleted={isCompleted}
            ref={activityPreviewRef}
          />
        )}
        {isTableActivity(activity) && (
          <TableViewer
            activity={activity}
            onWrongAnswer={() => setShowWrongAnswerModal(true)}
            onCorrectAnswer={() => setIsCompleted(true)}
            isCompleted={isCompleted}
            ref={activityPreviewRef}
          />
        )}
        {isMatchingActivity(activity) && (
          <MatchingViewer
            activity={activity}
            onWrongAnswer={() => setShowWrongAnswerModal(true)}
            onCorrectAnswer={() => setIsCompleted(true)}
            isCompleted={isCompleted}
            ref={activityPreviewRef}
          />
        )}
        {isTextInputActivity(activity) && (
          <TextInputViewer
            activity={activity}
            onWrongAnswer={() => setShowWrongAnswerModal(true)}
            onCorrectAnswer={() => setIsCompleted(true)}
            isCompleted={isCompleted}
            ref={activityPreviewRef}
          />
        )}
      </Box>
      <WrongAnswerModal
        open={showWrongAnswerModal}
        onClose={() => setShowWrongAnswerModal(false)}
      />
    </Dialog>
  );
};

export default PreviewLearnerModal;
